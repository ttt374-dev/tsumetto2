import { useEffect, useMemo, useState } from "react";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import type { SortState } from "@/domain/problem/query/sort";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useQuery } from "@/application/useQuery";
import { ProblemStats } from "@/domain/problem/ProblemStats";


export function useFilterProblems(){
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const learningStore = useLearningEventStore(repos.learningEvent)
    const query = useQuery() //  useMissionQueryContext()

    const reloadStores = async () => {
        await Promise.all([
            problemStore.reload(),
            learningStore.reload(),
        ])
        //console.log("reloaded stores")
    }

    const filteredProblems = useMemo(() => {
        const sortState: SortState = { key: "nextReviewedAt", order: "asc" }
        //console.log("fileteredproblems")
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
    const stats = useMemo(()=> 
        ProblemStats.create(filteredProblems, learningRecords),
    [filteredProblems, learningRecords])
    return {
        filteredProblems, reloadStores, query,
        problemIds: filteredProblems.map(p=>p.id),        
        stats
    }
}