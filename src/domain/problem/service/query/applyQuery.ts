import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { QueryState } from "./ProblemsQuery";
import type { LearningState } from "@/domain/learning/entity/LearningState";


export function applyQuery(problems: Problem[], learningRecords: Record<ProblemId, LearningState>,
    queryState: QueryState, limit: number | null = null){    
    
    const filtered = applyFilter(problems, learningRecords, queryState)
    const sorted = applySort(filtered, learningRecords, queryState)
    const limitted = limit ? sorted.slice(0, limit) : sorted
    return limitted
}