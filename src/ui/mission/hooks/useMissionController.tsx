import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/domain/Exercise/Exercise";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/mission/MissionSummary";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import type { SortState } from "@/domain/Exercise/query/sort";
import { JsonLearningEventPersistence, LearningEventRepository } from "@/domain/EventLog/LearningEventRepository";
import { createLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/EventLog/EventLog";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController(exercises: Exercise[],
    onPersistAnswer: (
        exercise: Exercise,
        solvedResult: SolvedResult,
        sec?: number
    ) => void,
    
) {
    const repo = LearningEventRepository.create(new JsonLearningEventPersistence())
    const learningEventStore = createLearningEventStore(repo)

    const [phase, setPhase] = useState<MissionPhase>("idle")
    const [index, setIndex] = useState(0)
    const [missionResultList, setMissionResultList] = useState<MissionResultEntry[]>([])
    const query = useMissionQueryContext()   
    const missionProblems = useMemo(()=> {        
        const sortState: SortState = { key: "nextReviewedAt", order: "asc"}
        const r = applyQuery(exercises, sortState, query.filterState)
        console.log("mission problems", r)
        return r
    },
        [exercises, query.filterState])    
    const currentExercise = missionProblems[index]
        
    // --- phase control ---
    const start = () => {
        if (exercises.length === 0) return
        setPhase("playing")
        setIndex(0)
        setMissionResultList([])
        //console.log("start", missionResultList)
    }
    const resetPhase = () => {
        setPhase("idle")        
    }

    // --- navigation ---
    const next = () => {
        setIndex(i => {
            if (i >= exercises.length - 1) {
                setPhase("summary")
                return i
            }
            return i + 1
        })
    }

    const prev = () => {
        setIndex(i => Math.max(0, i - 1))
    }

    // --- answer handling ---
    const answer = (
        problem: Problem,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {
        const entry: MissionResultEntry = {
            problemId: problem.id,
            solvedResult: solvedResult,
            //secToTaken,
        }

        setMissionResultList(prev => [...prev, entry])
        onPersistAnswer(currentExercise, solvedResult, secToTaken)
        const leanringEvent: LearningEvent = {
            type: "reviewed", problemId: currentExercise.problem.id, 
            quality: solvedResult, sec: secToTaken, at: 0
        }
        learningEventStore.append(leanringEvent)
        next()
    }

    // --- safety ---
    useEffect(() => {
        if (phase === "playing" && !currentExercise) {
            setPhase("summary")
        }
    }, [phase, currentExercise])

    return {
        // state
        phase,
        index,
        missionProblems,
        currentExercise,
        missionResultList,
        query,

        resetPhase,
        answer,
        start, next, prev,
    }
}

