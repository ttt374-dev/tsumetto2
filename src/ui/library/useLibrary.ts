import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem } from "../../domain/problem/Problem"
import { createLearningStore } from "../../application/store/useLearningStore"
import type { MissionItem } from "../../domain/missionItem/MissionItem"
import { useStoreContext } from "../App/providers/StoreProvider"
import { useMemo, useState } from "react"
import type { SortState } from "@/domain/missionItem/query/sort"
import { applySort } from "@/domain/missionItem/query/applySort"
import { DefaultFilterState, type FilterState } from "@/domain/missionItem/query/filter"
import { applyFilter } from "@/domain/missionItem/query/applyFilter"
import { applyQuery } from "@/domain/missionItem/query/applyQuery"

export function useLibrary() {
    //const repos = useRepositoryContext()    
    const stores = useStoreContext()
    const { problems, addProblem, toggleStar, setTitle, clearAll } = stores.problem
    const { learningRecords, update: updateLearning } = stores.learning
    const [ sortState, setSortState ] = useState<SortState>({
         key: "createdAt", order: "asc"
        })
    const [ filterState, setFilterState ] = useState<FilterState>(DefaultFilterState)
   
    const missionItems: MissionItem[] = useMemo(() => { 
        const items = problems.map((p) => ({
            problem: p,
            learning: learningRecords[p.id]
        }))
        return applyQuery(items, sortState, filterState)
        //const sorted = applySort(items, sortState)
        //const filtered = applyFilter(sorted, filterState)
        //return filtered
        
    }, [problems, learningRecords, sortState, filterState])

    const handleAddProblem = async () => {
        addProblem(Problem.create())
    }
    const handleToggleStar = async (m: MissionItem) => {
        await toggleStar(m.problem)
        //await setTitle(m.problem, "asdfasdf")
    }
    const handleAnswer = async (m: MissionItem) => {
        const problemId = m.problem.id
        updateLearning(problemId, r => r.answer())
    }
    const handleToggleSort = () => {
        const order = sortState.order === "asc" ? "desc" : "asc"
        setSortState(prev => { return { ...prev, order: order}})
        
    }
    const handleStarredOnly = () => {
        setFilterState(prev => { return { ...prev, starredOnly: !prev.starredOnly}})
    }

    return { 
        problems, learningRecords, missionItems,

        sortState, setSortState, filterState, setFilterState,
        handleToggleSort, handleStarredOnly,
        handleAddProblem, handleToggleStar, handleAnswer, clearAll}
}