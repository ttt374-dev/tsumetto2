import type { LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"
import { applyQuery } from "./query/applyQuery"
import type { FilterState } from "./query/filter"
import type { SortState } from "./query/sort"

export function createMissionItems(
    problems: Problem[], learningRecords: LearningRecord,
    sortState?: SortState, filterState?: FilterState,
) {
    const items = problems.map((p) => ({
        problem: p,
        learning: learningRecords[p.id]
    }))
    return applyQuery(items, sortState, filterState)
}