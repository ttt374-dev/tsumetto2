import { useEffect, useMemo, useState } from "react";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/mission/MissionSummary";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import type { SortState } from "@/domain/Exercise/query/sort";
import { createLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { createMissionEventStore } from "@/domain/MissionEvent/createMissionEventStore";
import type { MissionFinished, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";
import { createProblemStore } from "@/application/store/useProblemStore";
import { createExerciseList } from "@/domain/Exercise/createExerciseList";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController() {
    const repos = useRepositoryContext()
    const learningEventStore = createLearningEventStore(repos.learningEvent)
    const problemStore = createProblemStore(repos.problem)
    const learningRecords = learningEventStore.records
    
    const missionEventStore = createMissionEventStore()
    const snapshot = missionEventStore.snapshot


    const [phase, setPhase] = useState<MissionPhase>("idle")
    const [index, setIndex] = useState(0)
    const currentProblemId = snapshot && snapshot.problemIds[index]
    const currentProblem = snapshot ? problemStore.problems.find(p => p.id === currentProblemId) : undefined
    const currentLearning = snapshot && currentProblemId ? learningRecords[currentProblemId] : undefined
    const missionResultList: MissionResultEntry[] =
        snapshot
            ? Object.values(snapshot.answered).map(e => ({
                problemId: e.problemId,
                solvedResult: e.result,
            }))
            : []

    const query = useMissionQueryContext()   

    // --- phase control ---
    const start = () => {        
        const sortState: SortState = { key: "nextReviewedAt", order: "asc"}
        const exercises = createExerciseList(problemStore.problems, learningRecords)
        const r = applyQuery(exercises, sortState, query.filterState)
        if (r.length === 0) return
        const ev: MissionStarted = {
            type: "MissionStarted",
            missionId: crypto.randomUUID(),
            problemIds: r.map(e => e.problem.id), at: 0
        }
        missionEventStore.append(ev)
        setPhase("playing")

    }
    const resetPhase = () => {
        missionEventStore.reset
        setIndex(0)
        
        setPhase("idle")          // TODO
    }

    // --- navigation ---
    function next() {
        if (snapshot){
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                const event: MissionFinished = {
                    type: "MissionFinished",
                    missionId: snapshot.missionId,
                    at: Date.now(),
                }
                missionEventStore.append(event)
                setPhase("summary")
            }
        }       

        //snapshot && setIndex(i => Math.min(i + 1, snapshot.problemIds.length - 1))
    }

    function prev() {
        setIndex(i => Math.max(i - 1, 0))
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
        next()
        
    }

    function finish(missionId: string) {
        if (phase !== "playing") return
        
        missionEventStore.append({
            type: "MissionFinished",
            missionId: missionId
        })

        //setPhase("summary")
    }

    /* --- usecase --- */
      const importFiles = async (files: File[]) => {
        const usecase = createImportProblemsUsecase(repos.problem)
        await usecase.importFiles(files)
        //reload() // TODO
        //toast({ message: "imported" })
      }
      // stats
    const solvedCount = snapshot?.problemIds.reduce((sum, pid) => {
        const learning = learningRecords[pid];
        if (!learning) return sum;          // 学習記録がない場合はスキップ
        return sum + (learning.solvedCount ?? 0); // solvedCount を足す
    }, 0) ?? 0;
    const failedCount = snapshot?.problemIds.reduce((sum, pid) => {
        const learning = learningRecords[pid];
        if (!learning) return sum;          // 学習記録がない場合はスキップ
        return sum + (learning.failedCount ?? 0); // solvedCount を足す
    }, 0) ?? 0;
    return {
        // state
        phase,
        index,        
        currentProblem, currentProblemId, currentLearning,
        query, 
        snapshot: snapshot as ReadonlyMissionSnapshot,
        missionResultList,        

        resetPhase,
        answer, finish,
        start, next, prev,

        // stats
        solvedCount, failedCount
    }
}


export type ReadonlyMissionSnapshot =
    Readonly<MissionSnapshot>
