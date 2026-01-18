import { DefaultSortState, type SortKey, type SortState } from "@/domain/Exercise/query/sort"
import { DefaultFilterState, type FilterState } from "@/domain/Exercise/query/filter"
import { useState } from "react"
//import { useMediaQuery } from "@mui/material"

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
        //const order = sortState.order === "asc" ? "desc" : "asc"
        //setSortState(prev => { return { ...prev, order: order}})
        
    }

    const toggleFilter = (key: keyof FilterState) => {
        setFilterState(prev => ({ ...prev, [key]: !prev[key] }))
    }
    const setFilter = (key: keyof FilterState, value: boolean) => {
        setFilterState(prev => ({...prev, [key]: value}))
    }

    return {
        filterState, setFilterState, toggleFilter, setFilter,
        sortState, setSortState, toggleSort, 
    }
}