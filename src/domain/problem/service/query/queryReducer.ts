import { DefaultQueryState, type BooleanQueryKey, type QueryState, type QueryAction } from "./ProblemsQuery"

export function queryReducer(
    state: QueryState = DefaultQueryState,
    action: QueryAction
): QueryState {
    switch (action.type) {
        // SETTER
        case "SET_ALL":
            return {
                ...DefaultQueryState,
                ...action.payload
            }

        // ===== SORT =====
        case "SET_SORT_KEY":
            return {
                ...state,
                sortKey: action.key,
                sortOrder:
                    state.sortKey === action.key && state.sortOrder === "asc"
                        ? "desc"
                        : "asc"
            }

        case "TOGGLE_SORT_ORDER":
            return {
                ...state,
                sortOrder: state.sortOrder === "asc" ? "desc" : "asc"
            }

        // ===== FILTER =====
        case "SET_TEXT":
            return { ...state, text: action.text }

        case "SET_PROBLEM_TYPE":
            return { ...state, problemType: action.value }

        case "SET_SOURCE":
            return { ...state, source: action.value }

        case "SET_TAGS":
            return { ...state, tags: action.tags }

        case "SET_MATE_BUCKETS":
            return { ...state, mateBuckets: action.buckets }

        case "TOGGLE_FLAG": {
            const key: BooleanQueryKey = action.key

            return {
                ...state,
                [key]: !state[key]
            }
        }
        case "SET_PARTIAL":
            return {
                ...state,
                ...action.partial
            }

        case "RESET":
            return DefaultQueryState

        default:
            return state
    }
}