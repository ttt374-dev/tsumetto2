import type { LearningRecord } from "@/domain/learning/Learning";
import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { FilterState } from "./filter";
import type { SortState } from "./sort";
import type { Problem } from "@/domain/problem/entity/Problem";


export function applyQuery(problems: Problem[], learningRecords: LearningRecord,
    sortState?: SortState, filterState?: FilterState){    
    const filtered = filterState ? applyFilter(problems, learningRecords, filterState) : problems
    const sorted = sortState ? applySort(filtered, learningRecords, sortState) : filtered       
    return sorted
}