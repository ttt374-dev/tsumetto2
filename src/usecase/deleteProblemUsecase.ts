import { useStores } from "@/application/store/useStores";
import type { ProblemId } from "@/domain/problem/Problem";

export function useDeleteProblemsUseCase(){
    const stores = useStores()

    return async (ids: ProblemId[]) => {
        stores.problem.deleteProblems(ids)
        stores.learningEvent.deleteByProblemIds(ids)        
    }
    
}