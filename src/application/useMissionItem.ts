import { Problem, type ProblemId } from "../domain/problem/Problem"
import type { MissionItem } from "../domain/missionItem/MissionItem"
import { useStoreContext } from "../ui/App/providers/StoreProvider"
import { useMemo, useState } from "react"
import type { SortKey, SortState } from "@/domain/missionItem/query/sort"
import { applySort } from "@/domain/missionItem/query/applySort"
import { DefaultFilterState, type FilterState } from "@/domain/missionItem/query/filter"
import { applyFilter } from "@/domain/missionItem/query/applyFilter"
import { applyQuery } from "@/domain/missionItem/query/applyQuery"
import type { LearningRecord } from "@/domain/learning/Learning"
import { createMissionItems } from "@/domain/missionItem/createMissionItems"
import type { AnswerResult } from "@/domain/fsm/Fsm"

export function useMissionItem() {
    //const repos = useRepositoryContext()    
    const stores = useStoreContext()
    const { problems, 
        reload,
        addProblems, deleteProblem,
         toggleStar: storeToggleStar, setTitle, clearAll } = stores.problem
    const { learningRecords, update: updateLearning } = stores.learning
    const [ sortState, setSortState ] = useState<SortState>({
         key: "createdAt", order: "asc"
        })
    const [ filterState, setFilterState ] = useState<FilterState>(DefaultFilterState)
   
    const missionItems: MissionItem[] = useMemo(() => { 
        const items = createMissionItems(problems, learningRecords)
        return applyQuery(items, sortState, filterState)        
    }, [problems, learningRecords, sortState, filterState])

    /////////////////////////
    // query
    const find = (problemId: ProblemId): MissionItem | undefined => {
        return missionItems.find((m) => m.problem.id === problemId)
    }
    //////////////////////
    // command
    
    const toggleStar = (m: MissionItem) => {
        storeToggleStar(m.problem)
        //await setTitle(m.problem, "asdfasdf")
    }
    const markAnswer = (m: MissionItem, answerResult: AnswerResult, seconds: number = 10) => {
        console.log("mark answer", m, answerResult, seconds)
        const problemId = m.problem.id
        updateLearning(problemId, r => r.answer(answerResult, seconds))
    }
    const toggleSort = (key: SortKey) => {
        setSortState(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }))
        //const order = sortState.order === "asc" ? "desc" : "asc"
        //setSortState(prev => { return { ...prev, order: order}})
        
    }
    //const handleStarredOnly = () => {
     //   setFilterState(prev => { return { ...prev, starredOnly: !prev.starredOnly}})
    //}
    const toggleFilter = <K extends keyof FilterState>(key: K) => {
        setFilterState(prev => ({ ...prev, [key]: !prev[key] }))
    }


    return { 
        problems, learningRecords, missionItems, find,

        reload,
        sortState, setSortState, filterState, setFilterState,
        toggleSort, toggleFilter, addProblems, deleteProblem,
        toggleStar, markAnswer, clearAll}
}