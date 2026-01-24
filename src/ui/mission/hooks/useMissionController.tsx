import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/domain/Exercise/Exercise";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/mission/MissionSummary";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import type { SortState } from "@/domain/Exercise/query/sort";
import { createLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { createMissionEventStore } from "@/domain/MissionEvent/createMissionEventStore";
import type { MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";
import { createProblemStore } from "@/application/store/useProblemStore";
import { createExerciseList } from "@/domain/Exercise/createExerciseList";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController() {
    //const repo = LearningEventRepository.create(new JsonLearningEventPersistence())
    const repos = useRepositoryContext()
    const learningEventStore = createLearningEventStore(repos.learningEvent)
    const problemStore = createProblemStore(repos.problem)
    
    const missionEventStore = createMissionEventStore()
    const snapshot = missionEventStore.snapshot


    //const [phase, setPhase] = useState<MissionPhase>("idle")
    //const [index, setIndex] = useState(0)
    //const [missionResultList, setMissionResultList] = useState<MissionResultEntry[]>([])
    const phase: MissionPhase =
        snapshot?.phase === "playing"
            ? "playing"
            : snapshot?.phase === "finished"
                ? "summary"
                : "idle"

    const index = snapshot
        ? Object.keys(snapshot.answered).length
        : 0
    const currentProblemId = snapshot && snapshot.problemIds[index]
    const currentProblem = snapshot ? problemStore.problems.find(p => p.id === currentProblemId) : undefined
    const currentLearning = snapshot && currentProblemId ? learningEventStore.records[currentProblemId] : undefined
    const missionResultList: MissionResultEntry[] =
        snapshot
            ? Object.values(snapshot.answered).map(e => ({
                problemId: e.problemId,
                solvedResult: e.result,
            }))
            : []

    const query = useMissionQueryContext()   
    /*
    const query = useMissionQueryContext()   
    const missionProblems = useMemo(()=> {        
        const sortState: SortState = { key: "nextReviewedAt", order: "asc"}
        const exercises = createExerciseList(problemStore.problems, learningEventStore.records)
        const r = applyQuery(exercises, sortState, query.filterState)
        console.log("mission problems", r)
        return r
    },
        [problemStore.problems, query.filterState])    
    const currentExercise = missionProblems[index]
    */
        
    // --- phase control ---
    const start = () => {        
        const sortState: SortState = { key: "nextReviewedAt", order: "asc"}
        const exercises = createExerciseList(problemStore.problems, learningEventStore.records)
        const missionProblems = applyQuery(exercises, sortState, query.filterState)
        if (missionProblems.length === 0) return
        const ev: MissionStarted = {
            type: "MissionStarted",
            missionId: crypto.randomUUID(),
            problemIds: missionProblems.map(e => e.problem.id), at: 0
        }
        missionEventStore.append(ev)
        /*
        if (exercises.length === 0) return
        setPhase("playing")
        setIndex(0)
        setMissionResultList([])
        //console.log("start", missionResultList)
        */
    }
    const resetPhase = () => {
        //setPhase("idle")          // TODO
    }

    // --- navigation ---
    const next = () => {
        /*
        setIndex(i => {
            if (i >= exercises.length - 1) {
                setPhase("summary")
                return i
            }
            return i + 1
        })
            */
    }

    const prev = () => {
        //setIndex(i => Math.max(0, i - 1))
    }

    // --- answer handling ---
    const answer = (
        problem: Problem,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {
        if (!snapshot) return

        const missionEvent: MissionProblemAnswered = {
            type: "MissionProblemAnswered",
            missionId: snapshot.missionId,
            problemId: problem.id as ProblemId,
            result: solvedResult,
            sec: secToTaken, at: 0,
        }
        missionEventStore.append(missionEvent)

        // Learning への反映は「副作用」としてここで
        const learningEvent: LearningEvent = {
            type: "reviewed",
            problemId: problem.id,
            quality: solvedResult,
            sec: secToTaken,
            at: 0
        }
        learningEventStore.append(learningEvent)
        /*
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
        */
    }
/*
    // --- safety ---
    useEffect(() => {
        if (phase === "playing" && !currentExercise) {
            //setPhase("summary")
        }
    }, [phase, currentExercise])
*/
    /* --- usecase --- */
      const importFiles = async (files: File[]) => {
        const usecase = createImportProblemsUsecase(repos.problem)
        await usecase.importFiles(files)
        //reload() // TODO
        //toast({ message: "imported" })
      }
    return {
        // state
        phase,
        index,
        //missionProblems,
        //currentExercise,
        //missionResultList,
        currentProblem, currentProblemId, currentLearning,
        query, 
        snapshot: snapshot as ReadonlyMissionSnapshot,
        missionResultList,

        resetPhase,
        answer,
        start, next, prev,

        importFiles,
    }
}


export type ReadonlyMissionSnapshot =
    Readonly<MissionSnapshot>
