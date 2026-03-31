import type { LearningRecord } from "@/domain/learning/entity/Learning";
import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { QueryState } from "./ProblemsQuery";


export function applyQuery(problems: Problem[], learningRecords: LearningRecord,
    queryState: QueryState, limit: number | null = null){    
    
    const filtered = applyFilter(problems, learningRecords, queryState)
    const sorted = applySort(filtered, learningRecords, queryState)
    const limitted = limit ? sorted.slice(0, limit) : sorted
    return limitted
}