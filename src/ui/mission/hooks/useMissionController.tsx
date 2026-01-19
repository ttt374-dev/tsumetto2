import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/domain/Exercise/Exercise";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/mission/MissionSummary";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController(exercises: Exercise[],
    onPersistAnswer: (
        exercise: Exercise,
        solvedResult: SolvedResult,
        sec?: number
    ) => void
) {
    const [phase, setPhase] = useState<MissionPhase>("idle")
    const [index, setIndex] = useState(0)
    const [missionResultList, setMissionResultList] = useState<MissionResultEntry[]>([])
    const query = useMissionQueryContext()   
    const missionProblems = useMemo(()=> 
        applyQuery(exercises, query.sortState, query.filterState),
        [exercises, query])

    
    const currentExercise = useMemo(()=> { 
        return exercises[index]}, [exercises, index])

        
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

