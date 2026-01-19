import { Problem, type ProblemId } from "../domain/problem/Problem"
import { useEffect, useMemo, useState } from "react"

import { createExerciseList } from "@/domain/Exercise/createExerciseList"
import type { SolvedResult } from "@/application/missionFsm/MissionFsm"
import { createProblemStore } from "./store/useProblemStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { createLearningStore } from "./store/useLearningStore"
import type { Exercise } from "@/domain/Exercise/Exercise"

export function useExercise() {
    const repos = useRepositoryContext()    
    const stores = {
        problem: createProblemStore(repos.problem),
        learning: createLearningStore(repos.learning)
    }
    
    const exerciseList: Exercise[] = useMemo(() => { 
        return createExerciseList(stores.problem.problems, stores.learning.records)
    }, [stores.problem.problems, stores.learning.records])

    
    /////////////////////////
    // query
    const find = (problemId: ProblemId): Exercise | undefined => {
        return exerciseList.find((m) => m.problem.id === problemId)
    }
    //////////////////////
    // command    
    const markAnswer = (exercise: Exercise, answerResult: SolvedResult, secToTaken: number = 10) => {
        //console.log("mark answer", m, answerResult, seconds)
        stores.learning.update(exercise.problem.id, 
            learning => learning.answer(answerResult, secToTaken))
    }
    // delegat to store
    const toggleStar = (m: Exercise) => {
        stores.problem.toggleStar(m.problem)
    }

    return { 
        exerciseList, find,

        addProblems: stores.problem.add,
        deleteProblem: stores.problem.remove,
        reload: stores.problem.reset,
        deleteAllProblems: stores.problem.removeAll,
        toggleStar, markAnswer
    }
}