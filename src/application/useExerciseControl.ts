
import { Problem, type ProblemId } from "../domain/problem/Problem"
import { useEffect, useMemo, useState } from "react"

import { createExerciseList } from "@/domain/Exercise/createExerciseList"
import { createProblemStore } from "./store/useProblemStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { createLearningStore } from "./store/useLearningStore"
import type { Exercise } from "@/domain/Exercise/Exercise"
import type { SolvedResult } from "@/domain/mission/MissionSummary"
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase"

export function useExerciseControlDEPRECATE() {
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
      /* ---------- import ---------- */

  const importFiles = async (files: File[]) => {
    const usecase = createImportProblemsUsecase(repos.problem)
    await usecase.importFiles(files)
    reload()
    //toast({ message: "imported" })
  }
  const reload = () => {
    stores.problem.reset()
  }
  const deleteMany = (ids: ProblemId[]) => {
    stores.problem.removeMany(ids)
    stores.learning.removeMany(ids)
  }

    return { 
        exerciseList, find,

        addProblems: stores.problem.add,
        deleteProblem: stores.problem.remove,
        //reload: stores.problem.reset,
        reload,
        importFiles,
        deleteAllProblems: stores.problem.removeAll,
        deleteMany: stores.problem.removeMany,
        toggleStar, markAnswer
    }
}