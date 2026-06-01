import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

export function useProblemMutation() {
    const repos = useRepositoryContext()

    const patchProblem = useProblemStore(s => s.patchProblem)

    const byId = useProblemStore(s => s.byId)

    const updateProblem = async (id: ProblemId, updater: (p: Problem) => Problem) => {
        return updateProblems([id], updater)
    }

    const updateProblems = async (ids: ProblemId[], updater: (p: Problem) => Problem) => {
        const before: Record<ProblemId, Problem> = {}
        const updated: Problem[] = []

        for (const id of ids) {
            const current = byId[id]
            if (!current) continue

            const next = updater(current)
            if (next === current) continue

            before[id] = current
            updated.push(next)

            // optimistic update
            patchProblem(id, next)
        }

        if (updated.length === 0) return

        try {
            await repos.problem.updateMany(updated)
        } catch (e) {
            // rollback
            Object.entries(before).forEach(([id, problem]) => {
                patchProblem(id as ProblemId, problem)
            })
            throw e
        }
    }
    const deleteProblem = async (id: ProblemId) => {
        await updateProblem(id, p => p.softDelete())

    }
    const deleteProblems = async (ids: ProblemId[]) => {
        await updateProblems(ids, p => p.softDelete())
        //ids.map(deleteProblem)//
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