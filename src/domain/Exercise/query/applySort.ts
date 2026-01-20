// domain/problemRecord/sortProblemRecords.ts

import type { SortOrder, SortState } from "./sort"
import type { Exercise } from "../Exercise"

type SortKey = SortState["key"]
type SortValue = string | number

const sortValueGetters: Record<SortKey, (e: Exercise) => SortValue | null> = {
  title: (e) => e.problem.title ?? "",
  createdAt: (e) => e.problem.createdAt,
  random: () => Math.random(),

  easeFactor: (e) => e.learning?.easeFactor ?? null,
  nextReviewedAt: (e) => e.learning?.nextReviewedAt ?? null,

  moveCount: () => null,
  accuracy: () => null,
}


function compare(
    a: SortValue | null,
    b: SortValue | null,
    order: SortOrder
) {
    if (a == null && b == null) return 0
    if (a == null) return 1
    if (b == null) return -1

    if (a < b) return order === "asc" ? -1 : 1
    if (a > b) return order === "asc" ? 1 : -1
    return 0
}

export function applySort(
    exerciseList: Exercise[],
    sort: SortState
): Exercise[] {
    const getValue = sortValueGetters[sort.key]

    return [...exerciseList].sort((a, b) =>
        compare(getValue(a), getValue(b), sort.order)
    )
}
