import { useReducer } from "react";
import { queryReducer } from "./queryReducer";
import { DefaultProblemsQuery,  type BooleanQueryKey,  type QueryState } from "./ProblemsQuery";

import type { SortKey } from "./sort";
import type { ProblemType } from "../../entity/Problem";
import type { MateBucket } from "./filter";

export function useProblemsQuery(initial?: Partial<QueryState>) {
  const [query, dispatch] = useReducer(
    queryReducer,
    { ...DefaultProblemsQuery, ...initial }
  )

  return {
    state: query,

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