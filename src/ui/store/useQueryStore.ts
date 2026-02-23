import { create } from "zustand"
import { DefaultSortState, type SortState, type SortKey } from "@/domain/problem/service/query/sort"
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter"
import type { QueryController } from "../common/hooks/useQuery"

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