import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

export function useProblemMutation() {
    const repos = useRepositoryContext()
    
    const patchProblem = useProblemStore(s => s.patchProblem)

    const byId = useProblemStore(s => s.byId)

    const updateProblem = async (id: ProblemId, updater: (p: Problem) => Problem) => {
        const current = byId[id]
        if (!current) return

        const next = updater(current)
        if (next === current) return

        // optimistic update
        patchProblem(id, next)
        try {
            await repos.problem.update(next)
        } catch (e) {
            patchProblem(id, current)
            throw e
        }
    }
    const updateProblems = (ids: ProblemId[], updater: (p: Problem) => Problem) => {
        ids.map(id=>updateProblem(id, updater))
    }
    const deleteProblem = async (id: ProblemId) => {
        await updateProblem(id, p => p.softDelete())
    }
    const deleteProblems = (ids: ProblemId[]) => {
        ids.map(deleteProblem)
    }
    const toggleStar = async (id: ProblemId) => {
        await updateProblem(id, prev => prev.toggleStar())
    }
    return {
        updateProblem, updateProblems,
        deleteProblem, deleteProblems,
        toggleStar,
        
    }
}