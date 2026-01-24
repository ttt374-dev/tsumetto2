import { useEffect, useMemo, useState } from "react";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/mission/MissionSummary";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import type { SortState } from "@/domain/problem/query/sort";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { createMissionEventStore } from "@/domain/MissionEvent/createMissionEventStore";
import type { MissionFinished, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";
import { useProblemStore } from "@/application/store/useProblemStore";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController() {
    const repos = useRepositoryContext()
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const problemStore = useProblemStore(repos.problem)
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

    const filteredProblems = useMemo(() => {
        const sortState: SortState = { key: "nextReviewedAt", order: "asc" }
        return applyQuery(problemStore.problems, learningRecords, sortState, query.filterState)
    }, [problemStore.problems, learningRecords, query.filterState])

    // --- phase control ---
    const start = () => {
        if (filteredProblems.length === 0) return
        const ev: MissionStarted = {
            type: "MissionStarted",
            missionId: crypto.randomUUID(),
            problemIds: filteredProblems.map(p => p.id), at: Date.now()
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
        if (snapshot) {
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                missionEventStore.append({
                    type: "MissionFinished",
                    missionId: snapshot.missionId
                })

                setPhase("summary")
            }

        }
    }
    function prev() {
        setIndex(i => Math.max(i - 1, 0))
    }


    // --- answer handling ---
    const answer = async (
        problem: Problem,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {

        if (!snapshot) return
        const missionEvent: Omit<MissionProblemAnswered, "at"> = {
            type: "MissionProblemAnswered",
            missionId: snapshot.missionId,
            problemId: problem.id as ProblemId,
            result: solvedResult,
            sec: secToTaken,
        }
        missionEventStore.append(missionEvent)

        // Learning への反映は「副作用」としてここで
        const learningEvent: Omit<LearningEvent, "at"> = {
            type: "reviewed",
            problemId: problem.id,
            quality: solvedResult,
            sec: secToTaken,
            //at: Date.now()
        }
        await learningEventStore.append(learningEvent)
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


    // stats
    const problemCount = useMemo(()=>{
        return filteredProblems.length
        
    }, [snapshot, query.filterState])
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
        problemCount, solvedCount, failedCount
    }
}

export type ReadonlyMissionSnapshot =
    Readonly<MissionSnapshot>
