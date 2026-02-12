import { useMemo } from "react"
import { useStores } from "./store/useStores"
import type { Problem, ProblemId } from "@/domain/problem/Problem"

export function useProblemLearning() {
    const { problem, learningRecords } = useStores()

    const learningProblems = useMemo(() => {
        return problem.problems.map(p => ({
            problem: p,
            learning: learningRecords[p.id]
        }))
    }, [problem.problems, learningRecords])

    const saveProblem = (p: Problem) => {
        problem.updateProblem(p)
    }

    const deleteProblem = (id: ProblemId) => {
        problem.deleteProblems([id])
        //learningEvent.deleteByProblemId(id)
    }

    return {
        learningProblems,
        save: saveProblem,
        delete: deleteProblem,
    }
}
