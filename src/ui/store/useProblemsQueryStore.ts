import { create } from "zustand"
import { type SortKey } from "@/domain/problem/service/query/sort"
import { type MateBucket } from "@/domain/problem/service/query/filter"
import { DefaultQueryState, type BooleanQueryKey, type QueryAction, type QueryState } from "@/domain/problem/service/query/ProblemsQuery"
import { queryReducer } from "@/domain/problem/service/query/queryReducer"
import type { ProblemType } from "@/domain/problem/entity/Problem"

type QueryStore = {
  state: QueryState
  dispatch: (action: QueryAction) => void

  // ---- convenience API ----
  setAll: (payload: Partial<QueryState>) => void
  setSortKey: (key: SortKey) => void
  toggleSortOrder: () => void

  setText: (text?: string) => void
  setProblemType: (value?: ProblemType) => void
  setSource: (value?: string) => void
  setTags: (tags?: string[]) => void
  setMateBuckets: (buckets?: MateBucket[]) => void

  toggleFlag: (key: BooleanQueryKey) => void
  setPartial: (partial: Partial<QueryState>) => void
  reset: () => void
}

export const useProblemsQueryStore = create<QueryStore>((set, get) => ({
  state: DefaultQueryState,

  // -----------------------
  // core
  // -----------------------
  dispatch: (action) =>
    set((store) => ({
      state: queryReducer(store.state, action),
    })),

  // -----------------------
  // convenience wrappers
  // -----------------------
  setAll: (payload) =>
    get().dispatch({ type: "SET_ALL", payload }),

  setSortKey: (key) =>
    get().dispatch({ type: "SET_SORT_KEY", key }),

  toggleSortOrder: () =>
    get().dispatch({ type: "TOGGLE_SORT_ORDER" }),

  setText: (text) =>
    get().dispatch({ type: "SET_TEXT", text }),

  setProblemType: (value) =>
    get().dispatch({ type: "SET_PROBLEM_TYPE", value }),

  setSource: (value) =>
    get().dispatch({ type: "SET_SOURCE", value }),

  setTags: (tags) =>
    get().dispatch({ type: "SET_TAGS", tags }),

  setMateBuckets: (buckets) =>
    get().dispatch({ type: "SET_MATE_BUCKETS", buckets }),

  toggleFlag: (key) =>
    get().dispatch({ type: "TOGGLE_FLAG", key }),

  setPartial: (partial) =>
    get().dispatch({ type: "SET_PARTIAL", partial }),

  reset: () =>
    get().dispatch({ type: "RESET" }),
}))
/*
export const useQueryStore = create<QueryController>((set, get) => ({
  sort: {
    state: { ...DefaultSortState },
    setKey: (key: SortKey) =>
      set(state => ({
        sort: {
          ...state.sort,
          state: {
            key,
            order:
              state.sort.state.key === key && state.sort.state.order === "asc"
                ? "desc"
                : "asc"
          }
        }
      })),
    toggleOrder: () =>
      set(state => ({
        sort: {
          ...state.sort,
          state: {
            ...state.sort.state,
            order: state.sort.state.order === "asc" ? "desc" : "asc"
          }
        }
      })),
    setState: state => set(s => ({ sort: { ...s.sort, state } })),
    reset: () => set(s => ({ sort: { ...s.sort, state: { ...DefaultSortState } } }))
  },
  filter: {
    state: { ...DefaultFilterState },
    toggleFilter: key =>
      set(s => ({
        filter: { ...s.filter, state: { ...s.filter.state, [key]: !s.filter.state[key] } }
      })),
    addFilter: partial =>
      set(s => ({ filter: { ...s.filter, state: { ...s.filter.state, ...partial } } })),
    setState: state => set(s => ({ filter: { ...s.filter, state } })),
    reset: () => set(s => ({ filter: { ...s.filter, state: { ...DefaultFilterState } } }))
  }
}))
  */