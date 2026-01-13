import { Problem, type ProblemId } from "../domain/problem/Problem"
import type { MissionItem } from "../domain/missionItem/MissionItem"
import { useMemo, useState } from "react"

import { createMissionItems } from "@/domain/missionItem/createMissionItems"
import type { AnswerResult } from "@/domain/fsm/Fsm"
import { createProblemStore } from "./store/useProblemStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { createLearningStore } from "./store/useLearningStore"

export function useMissionItem() {
    const repos = useRepositoryContext()    
    //const stores = useStoreContext()
    const { problems, 
        reload,
        addProblems, deleteProblem,
         toggleStar: storeToggleStar, setTitle, clearAll } = createProblemStore(repos.problem) //stores.problem
    const { learningRecords, update: updateLearning } = createLearningStore(repos.learning)  // stores.learning

    const missionItems: MissionItem[] = useMemo(() => { 
        return createMissionItems(problems, learningRecords)
     //   return applyQuery(items, sortState, filterState)        
    }, [problems, learningRecords]) // , sortState, filterState])

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
   
    //const handleStarredOnly = () => {
     //   setFilterState(prev => { return { ...prev, starredOnly: !prev.starredOnly}})
    //}
    //const toggleFilter = <K extends keyof FilterState>(key: K) => {


    return { 
        //problems, learningRecords, 
        missionItems, find,

        reload,
        
        
        addProblems, deleteProblem,
        toggleStar, markAnswer, clearAll}
}