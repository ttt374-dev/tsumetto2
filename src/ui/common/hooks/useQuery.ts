import { DefaultSortState, type SortKey, type SortState } from "@/domain/problem/service/query/sort"
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter"
import { useState } from "react"

type UseQueryOptions = {
  sort?: Partial<SortState>
  filter?: Partial<FilterState>
}

export type UseQuery = {
    sort: {
        state: SortState,
        setKey: (key: SortKey) => void
        toggleOrder: () => void
        setState: (state: SortState) => void
        reset: () => void
    },
    filter: {
        state: FilterState,
        setFilter: (partial: Partial<FilterState>) => void
        setState: (state: FilterState) => void
        reset: () => void
    }
}
export function useQuery(options?: UseQueryOptions){
    const [ sortState, setSortState ] = useState<SortState>(
        {...DefaultSortState, ...options?.sort})
    const [ filterState, setFilterState ] = useState<FilterState>(
        {...DefaultFilterState, ...options?.filter})   

    // sort
     const setKey = (key: SortKey) => {
        setSortState(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }))
    }
    const toggleOrder = () => {
        setSortState(prev => ({
            ...prev,
            order: prev.order === 'asc' ? 'desc' : 'asc'
        }))
    }    
    const resetSort = () => {
        setSortState({...DefaultSortState})
    }
    /// filter
    
    const toggleFilter = (key: keyof FilterState) => {
        setFilterState(prev => ({ ...prev, [key]: !prev[key] }))
    }
    
    const addFilter = (partial: Partial<FilterState>) => {            
        setFilterState(prev => ({...prev, ...partial }))
    }
    const resetFilter = () => {
        setFilterState({ ...DefaultFilterState})
    }

    return {
        sort: { 
            state: sortState, 
            setKey, toggleOrder, setState: setSortState, reset: resetSort,
        },
        filter: {
            state: filterState,
            toggleFilter, addFilter, setState: setFilterState, reset: resetFilter,
        }
        
    }

}

/*
export type UseQuery = {
    sortState: SortState,
    filterState: FilterState,

    setSortState: (r:  React.Dispatch<React.SetStateAction<SortState>>) => void
    toggleSort: (key: SortKey) => void
    toggleFilter: (key: keyof FilterState) => void
    setFilter: (partial: Partial<FilterState>) => void
    resetFilter: () => void

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
    const toggleSortOrder = () => {
        setSortState(prev => ({
            ...prev,
            order: prev.order === 'asc' ? 'desc' : 'asc'
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
        sortState, setSortState, toggleSort, toggleSortOrder,
    }
}*/