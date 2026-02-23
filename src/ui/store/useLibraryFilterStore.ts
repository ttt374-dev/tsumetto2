import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter";
import { DefaultSortState, type SortKey, type SortState } from "@/domain/problem/service/query/sort";
import type { UseQuery, useQuery } from "../common/hooks/useQuery";
import { create } from "zustand";

type LibraryQueryStore = {
    sortState: SortState,
    filterState: FilterState,

    toggleSort: (key: SortKey) => void
    toggleFilter: (key: keyof FilterState) => void
    setFilter: (partial: Partial<FilterState>) => void
    resetFilter: () => void

}


export const useLibraryQueryStore = create<LibraryQueryStore>((set, get) => ({
  sortState: DefaultSortState,
  filterState: DefaultFilterState,

  toggleSort: (key: SortKey) =>
    set((state) => ({
      sortState: {
        key,
        order: state.sortState.key === key && state.sortState.order === "asc" ? "desc" : "asc",
      },
    })),

  toggleFilter: (key: keyof FilterState) =>
    set((state) => ({
      filterState: { ...state.filterState, [key]: !state.filterState[key] },
    })),

  setFilter: (partial: Partial<FilterState>) =>
    set((state) => ({ filterState: { ...state.filterState, ...partial } })),

  resetFilter: () =>
    set({ filterState: { ...DefaultFilterState }, sortState: { ...DefaultSortState } }),
}))