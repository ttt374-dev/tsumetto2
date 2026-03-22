import type { ProblemType } from "@/domain/problem/entity/Problem";

// sort
export type SortKey =
  'createdAt' | 'title' | 'moveCount' |
  'accuracy' | 'easeFactor' | 'nextReviewedAt' | 'lastAnsweredAt' |
  'random'
export type SortOrder = 'asc' | 'desc';


// ====================
// filter
export type MateBucket =
    | "lte3"
    | "eq5"
    | "eq7"
    | "gte9"
// ====================
// query
export type QueryState = {
    // sort
    sortKey: SortKey
    sortOrder: SortOrder

    // filter
    text?: string
    unansweredOnly: boolean
    dueForReviewOnly: boolean
    starredOnly: boolean
    problemType?: ProblemType
    source?: string

    tags?: string[]
    mateBuckets?: MateBucket[]
}

export type BooleanQueryKey = "starredOnly" | "unansweredOnly" | "dueForReviewOnly"

export type QueryAction =
    // setter
    | { type: "SET_ALL", payload: Partial<QueryState>}
    // sort
    | { type: "SET_SORT_KEY"; key: SortKey }
    | { type: "TOGGLE_SORT_ORDER" }
    // filter
    | { type: "SET_TEXT"; text?: string }
    | { type: "SET_PROBLEM_TYPE"; value?: ProblemType }
    | { type: "SET_SOURCE"; value?: string }
    | { type: "SET_TAGS"; tags?: string[] }
    | { type: "SET_MATE_BUCKETS"; buckets?: MateBucket[] }
    | { type: "TOGGLE_FLAG"; key: BooleanQueryKey }
    | { type: "SET_PARTIAL"; partial: Partial<QueryState> }
    | { type: "RESET" }

export const DefaultQueryState: QueryState = {
    sortKey: 'createdAt',
    sortOrder: 'desc',

    unansweredOnly: false,
    dueForReviewOnly: false,
    starredOnly: false,
}

