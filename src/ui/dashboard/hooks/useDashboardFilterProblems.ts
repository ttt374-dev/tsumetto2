import { useEffect, useMemo, useState } from "react";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import type { SortState } from "@/domain/problem/query/sort";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { MissionSummary } from "@/domain/MissionEvent/MissionSummary";


export function useDashboardFilterProblems(){
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const learningStore = useLearningEventStore(repos.learningEvent)
    const query = useMissionQueryContext()

    const reloadStores = async () => {
        await Promise.all([
            problemStore.reload(),
            learningStore.reload(),
        ])
        //console.log("reloaded stores")
    }

    const filteredProblems = useMemo(() => {
        const sortState: SortState = { key: "nextReviewedAt", order: "asc" }
        console.log("fileteredproblems")
        return applyQuery(
            problemStore.problems,
            learningStore.records,
            sortState,
            query.filterState
        )
    }, [
        problemStore.problems,
        learningStore.records,
        query.filterState
    ])
    const learningRecords = learningStore.records
    // stats
    const missionSummary = useMemo(() => {
        const problemCount = filteredProblems.length

        let solvedCount = 0
        let failedCount = 0

        for (const p of filteredProblems) {
            const learning = learningRecords[p.id]
            if (!learning) continue
            solvedCount += learning.solvedCount ?? 0
            failedCount += learning.failedCount ?? 0
        }
        //console.log("stats", problemCount)

        return new MissionSummary(problemCount, solvedCount, failedCount)
    }, [filteredProblems, learningRecords])

    return {
        filteredProblems, reloadStores, query,
        problemIds: filteredProblems.map(p=>p.id),
        // stats
        missionSummary
    }
}