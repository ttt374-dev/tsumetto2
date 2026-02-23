import { DefaultSortState, type SortKey, type SortState } from "@/domain/problem/service/query/sort"
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter"
import { useState } from "react"

type UseQueryOptions = {
  sort?: Partial<SortState>
  filter?: Partial<FilterState>
}

export type UseQuery = QueryController

export type QueryController = {
    sort: {
        state: SortState,
        setKey: (key: SortKey) => void
        toggleOrder: () => void
        setState: (state: SortState) => void
        reset: () => void
    },
    filter: {
        state: FilterState,
        toggleFilter: (key: keyof FilterState) => void
        addFilter: (partial: Partial<FilterState>) => void
        setState: (state: FilterState) => void
        reset: () => void
    }
}

export const useQuery = queryController

export function queryController(options?: UseQueryOptions): QueryController{
    const [ sortState, setSortState ] = useState<SortState>(
        {...DefaultSortState, ...options?.sort})
    const [ filterState, setFilterState ] = useState<FilterState>(
        {...DefaultFilterState, ...options?.filter})   

  const sort = {
    state: sortState,
    setKey: (key: SortKey) =>
      setSortState(prev => ({
        key,
        order: prev.key === key && prev.order === "asc" ? "desc" : "asc"
      })),
    toggleOrder: () => setSortState(prev => ({ ...prev, order: prev.order === "asc" ? "desc" : "asc" })),
    setState: setSortState,
    reset: () => setSortState({ ...DefaultSortState })
  }

  const filter = {
    state: filterState,
    toggleFilter: (key: keyof FilterState) => setFilterState(prev => ({ ...prev, [key]: !prev[key] })),
    addFilter: (partial: Partial<FilterState>) => setFilterState(prev => ({ ...prev, ...partial })),
    setState: setFilterState,
    reset: () => setFilterState({ ...DefaultFilterState })
  }

  return { sort, filter }

}
