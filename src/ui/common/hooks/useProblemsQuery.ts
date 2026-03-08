import { useReducer } from "react";
import { queryReducer } from "../../../domain/problem/service/query/queryReducer";
import { DefaultQueryState,  type BooleanQueryKey,  type QueryState } from "../../../domain/problem/service/query/ProblemsQuery";

import type { SortKey } from "../../../domain/problem/service/query/sort";
import type { ProblemType } from "../../../domain/problem/entity/Problem";
import type { MateBucket } from "../../../domain/problem/service/query/filter";

export function useProblemsQuery(initial?: Partial<QueryState>) {
  const [query, dispatch] = useReducer(
    queryReducer,
    { ...DefaultQueryState, ...initial }
  )

  return {
    state: query,

    // setter
    setAll: (state: Partial<QueryState>) =>
        dispatch({ type: "SET_ALL", payload: state }),

    // sort
    setSortKey: (key: SortKey) =>
      dispatch({ type: "SET_SORT_KEY", key }),

    toggleSortOrder: () =>
      dispatch({ type: "TOGGLE_SORT_ORDER" }),

    // filter
    setText: (text?: string) =>
      dispatch({ type: "SET_TEXT", text }),

    setProblemType: (value?: ProblemType) =>
      dispatch({ type: "SET_PROBLEM_TYPE", value }),

    setSource: (value?: string) =>
      dispatch({ type: "SET_SOURCE", value }),

    setTags: (tags?: string[]) =>
      dispatch({ type: "SET_TAGS", tags }),

    setMateBuckets: (buckets?: MateBucket[]) =>
      dispatch({ type: "SET_MATE_BUCKETS", buckets }),

    toggleFlag: (key: BooleanQueryKey) =>
      dispatch({ type: "TOGGLE_FLAG", key }),

    setPartial: (partial: Partial<QueryState>) =>
      dispatch({ type: "SET_PARTIAL", partial }),

    reset: () =>
      dispatch({ type: "RESET" })
  }
}