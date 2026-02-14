import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useStores } from "@/application/store/useStores"
import type { SolvedResult } from "@/domain/learning/Learning"
import type { Problem, ProblemId } from "@/domain/problem/Problem"

export function usePlayerController(missionAnswer: (solvedResult: SolvedResult, secToTaken?: number) => Promise<void>) {
    //const stores = useStores()
    const review = useLearningEventStore(s=>s.review)

    const updateProblem = async (p: Problem) => {
        //await stores.problem.updateProblem(p)
        
    }
    const answer = async (id: ProblemId, solvedResult: SolvedResult, secToTaken?: number) => {
        await missionAnswer(solvedResult, secToTaken) // mission アクション 
        await review(id, solvedResult, secToTaken)
    }
    return {
        updateProblem, answer,
    }
}