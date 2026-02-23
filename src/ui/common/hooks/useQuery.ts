import { DefaultSortState, type SortKey, type SortState } from "@/domain/problem/service/query/sort"
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter"
import { useState } from "react"

type UseQueryOptions = {
  sort?: Partial<SortState>
  filter?: Partial<FilterState>
}

export function useQuery(options?: UseQueryOptions){
    const [ sortState, setSortState ] = useState<SortState>(
        {...DefaultSortState, ...options?.sort})
    const [ filterState, setFilterState ] = useState<FilterState>(
        {...DefaultFilterState, ...options?.filter})   

     const toggleSort = (key: SortKey) => {
        setSortState(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }))
    }

    const toggleFilter = (key: keyof FilterState) => {
        setFilterState(prev => ({ ...prev, [key]: !prev[key] }))
    }
    const setFilter = (partial: Partial<FilterState>) => {    
        
        setFilterState(prev => ({...prev, ...partial }))
    }
    const resetFilter = () => {
        setFilter({ ...DefaultFilterState})
    }

    return {
        filterState, setFilterState, toggleFilter, setFilter, resetFilter,
        sortState, setSortState, toggleSort, 
    }
}