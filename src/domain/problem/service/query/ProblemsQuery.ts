import type { ProblemType } from "../../entity/Problem"
import type { MateBucket } from "./filter"
import type { SortKey, SortOrder } from "./sort"


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
    sortKey: 'title',
    sortOrder: 'asc',

    unansweredOnly: false,
    dueForReviewOnly: false,
    starredOnly: false,
}