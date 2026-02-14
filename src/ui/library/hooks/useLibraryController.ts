import { useProblemStore } from "@/application/store/useProblemStore"
import type { useStores } from "@/application/store/useStores"
import type { Problem, ProblemId } from "@/domain/problem/Problem"

export function useLibraryController() {
    // command
    /*
    const reload = async () => {
        //await store.reload()
        useProblemStore(s=>s.reload)
    }    
    const deleteMany = async (ids: ProblemId[]) => {        
        //await store.deleteProblems(ids)   
        //return ids.length     
        useProblemStore(s=>s.deleteProblems)
    }
    const updateProblem = async (p: Problem) => {
        //await store.updateProblem(p)
        useProblemStore(s=>s.updateProblem)
    }*/
    return {
        reload: useProblemStore(s=>s.reload),
        deleteMany: useProblemStore(s=>s.deleteProblems),
        updateProblem: useProblemStore(s=>s.updateProblem),
    }
}