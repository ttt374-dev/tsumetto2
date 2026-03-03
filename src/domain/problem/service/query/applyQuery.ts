import type { LearningRecord } from "@/domain/learning/entity/Learning";
import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { FilterState } from "./filter";
import type { SortState } from "./sort";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { QueryState } from "./ProblemsQuery";


export function applyQuery(problems: Problem[], learningRecords: LearningRecord,
    queryState: QueryState){    
    console.log("applyquery", queryState)
    const filtered = applyFilter(problems, learningRecords, queryState)
    const sorted = applySort(filtered, learningRecords, queryState)
    return sorted
}