import { useEffect, useMemo, useState } from "react";
import { useMissionQueryContext } from "@/ui/App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import type { SortState } from "@/domain/problem/query/sort";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";


export function useMissionPreview(){
    const repos = useRepositoryContext()

    const problemStore = useProblemStore(repos.problem)
    const learningStore = useLearningEventStore(repos.learningEvent)
    const query = useMissionQueryContext()

    const reload = () => {
        problemStore.reload()
        learningStore.reload()
    }
    const filteredProblems = useMemo(() => {
        const sortState: SortState = { key: "nextReviewedAt", order: "asc" }
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
    const problemCount = useMemo(()=>{
        console.log("problemcount", filteredProblems.length)
        return filteredProblems.length
    }, [filteredProblems])

    const solvedCount = filteredProblems.reduce((sum, p) => {
        const learning = learningRecords[p.id];
        if (!learning) return sum;          // 学習記録がない場合はスキップ
        return sum + (learning.solvedCount ?? 0); // solvedCount を足す
    }, 0) ?? 0;
    const failedCount = filteredProblems.reduce((sum, p) => {
        const learning = learningRecords[p.id];
        if (!learning) return sum;         
        return sum + (learning.failedCount ?? 0);
    }, 0) ?? 0;

    return {
        filteredProblems, reload, query,      
        // stats
        problemCount, solvedCount, failedCount
    }
}