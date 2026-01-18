import { Problem, type ProblemId } from "../domain/problem/Problem"
import { useMemo, useState } from "react"

import { createExerciseList } from "@/domain/Exercise/createExerciseList"
import type { AnswerResult } from "@/application/missionFsm/MissionFsm"
import { createProblemStore } from "./store/useProblemStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { createLearningStore } from "./store/useLearningStore"
import type { Exercise } from "@/domain/Exercise/Exercise"

export function useExercise() {
    const repos = useRepositoryContext()    
    //const stores = useStoreContext()
    const { problems, 
        reload,
        addProblems, deleteProblem,
         toggleStar: storeToggleStar, setTitle, clearAll } = createProblemStore(repos.problem) //stores.problem
    const { learningRecords, update: updateLearning } = createLearningStore(repos.learning)  // stores.learning

    const exerciseList: Exercise[] = useMemo(() => { 
        return createExerciseList(problems, learningRecords)
    }, [problems, learningRecords]) // , sortState, filterState])
    
    /////////////////////////
    // query
    const find = (problemId: ProblemId): Exercise | undefined => {
        return exerciseList.find((m) => m.problem.id === problemId)
    }
    //////////////////////
    // command
    
    const toggleStar = (m: Exercise) => {
        storeToggleStar(m.problem)
        //await setTitle(m.problem, "asdfasdf")
    }
    const markAnswer = (m: Exercise, answerResult: AnswerResult, seconds: number = 10) => {
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
        exerciseList, find,

        reload,
        
        
        addProblems, deleteProblem,
        toggleStar, markAnswer, clearAll}
}