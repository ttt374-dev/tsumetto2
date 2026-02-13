import type { useProblemStore } from "@/application/store/useProblemStore"
import type { useStores } from "@/application/store/useStores"
import type { Problem, ProblemId } from "@/domain/problem/Problem"

export function useLibraryController(store: ReturnType<typeof useProblemStore>) {
    // command
    const reload = async () => {
        await store.reload()
    }    
    const deleteMany = async (ids: ProblemId[]) => {        
        await store.deleteProblems(ids)   
        return ids.length     
    }
    const updateProblem = async (p: Problem) => {
        await store.updateProblem(p)
    }
    return {
        reload,
        deleteMany,
        updateProblem,
    }
}