import { DefaultSortState, type SortKey, type SortState } from "@/domain/missionItem/query/sort"
import { applySort } from "@/domain/missionItem/query/applySort"
import { DefaultFilterState, type FilterState } from "@/domain/missionItem/query/filter"
import { applyFilter } from "@/domain/missionItem/query/applyFilter"
import { applyQuery } from "@/domain/missionItem/query/applyQuery"
import { useState } from "react"
//import { useMediaQuery } from "@mui/material"


export function useQuery(){
    const [ sortState, setSortState ] = useState<SortState>(DefaultSortState)
    const [ filterState, setFilterState ] = useState<FilterState>(DefaultFilterState)   

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