// application/store/problemStore.ts
import { create } from "zustand"
import { ProblemRepository } from "../../domain/problem/ProblemRepository"
import type { Problem, ProblemId } from "../../domain/problem/Problem"

export type ProblemState = {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>
    all: Problem[]
    allTags: string[]

    // loading state
    loading: boolean,
    hydrated: boolean,
    hydrate: () => Promise<void>,

    reload: () => Promise<void>
    setProblems: (problems: Problem[]) => void
    //addProblem: (problem: Problem) => void
    //updateProblem: (p: Problem) => Promise<void>
    updateProblem: (id: ProblemId, updater: (p: Problem) => Problem) => Promise<void>
    updateProblems: (ids: string[], updater: (p: Problem) => Problem) => Promise<void>
    deleteProblem: (id: ProblemId) => Promise<void>
    deleteProblems: (ids: ProblemId[]) => Promise<void>
    toggleStar: (id: ProblemId) => Promise<void>
    deleteAll: () => Promise<void>
}

let repository: ProblemRepository

export const initProblemStore = (repo: ProblemRepository) => {
    repository = repo
}
export function extractTags(problems: Problem[]): string[] {
    const tagSet = new Set<string>()
    problems.forEach(p => p.tags?.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet)
}

export const useProblemStore = create<ProblemState>((set, get) => ({
    ids: [],
    byId: {},
    all: [],
    allTags: [],

    loading: false,
    hydrated: false,
    hydrate: async () => {
        set({ loading: true })
        const problems = await repository.load()

        const map: Record<ProblemId, Problem> = {}
        for (const p of problems) {
            map[p.id] = p
        }

        set({
            byId: map,
            hydrated: true,
            loading: false,
        })
    },


    reload: async () => {
        try {
            const data = await repository.load()
            const byId: Record<ProblemId, Problem> = {}
            const ids: ProblemId[] = []

            data.forEach(p => {
                byId[p.id] = p
                ids.push(p.id)
            })

            set({
                ids,
                byId,
                all: data,
                allTags: extractTags(data),
            })
        } catch {
            set({ ids: [], byId: {}, all: [], allTags: [] })
        }
    },

    setProblems: (problems) => {
        const byId: Record<ProblemId, Problem> = {}
        const ids: ProblemId[] = []

        problems.forEach(p => {
            byId[p.id] = p
            ids.push(p.id)
        })

        set({
            ids,
            byId,
            all: problems,
            allTags: extractTags(problems),
        })
    },
    /*
    updateProblem: async (problem) => {        
        set((prev) => {
            const newAll = prev.all.map(p => p.id === problem.id ? problem : p)
            return {
                byId: { ...prev.byId, [problem.id]: problem },
                all: newAll,
                allTags: extractTags(newAll),
            }
        })
        await repository.update(problem)
    },
    */
    updateProblem: async(id, updater) => {
        get().updateProblems([id], updater)
    },
    updateProblems: async (ids, updater) => {
        const state = get()

        const updated: Problem[] = []
        const newById = { ...state.byId }

        for (const id of ids) {
            const current = newById[id]
            if (!current) continue

            const next = updater(current)

            if (next !== current) {
                newById[id] = next
                updated.push(next)
            }
        }

        if (updated.length === 0) return

        // ① all を再構築
        const newAll = state.all.map(p =>
            newById[p.id] ?? p
        )

        // ② 楽観的更新
        set({
            byId: newById,
            all: newAll,
            allTags: extractTags(newAll),
        })

        // ③ 永続化
        await repository.updateMany(updated)
    },

    toggleStar: async (id: ProblemId) => {
        get().updateProblem(id, prev => prev.toggleStar())
    },
    deleteProblem: async (id: ProblemId) => {
        get().deleteProblems([id])
    },

    deleteProblems: async (idsToDelete) => {
        await repository.removeMany(idsToDelete)
        const deleteSet = new Set(idsToDelete)

        set((prev) => {
            const newAll = prev.all.filter(p => !deleteSet.has(p.id))
            const newById = { ...prev.byId }
            deleteSet.forEach(id => delete newById[id])
            return {
                ids: prev.ids.filter(id => !deleteSet.has(id)),
                byId: newById,
                all: newAll,
                allTags: extractTags(newAll),
            }
        })
    },

    deleteAll: async () => {
        await repository.removeAll()
        set({ ids: [], byId: {}, all: [], allTags: [] })
    },
}))