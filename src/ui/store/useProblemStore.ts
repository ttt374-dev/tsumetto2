// application/store/problemStore.ts
import { create } from "zustand"
import { ProblemRepository } from "../../domain/problem/ProblemRepository"
import type { Problem, ProblemId } from "../../domain/problem/entity/Problem"

export type ProblemState = {
    byId: Record<ProblemId, Problem>   // SoT

    // derived states
    ids: ProblemId[]
    allTags: string[]
    activeProblems: Problem[]    
    
    reload: () => Promise<void>
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

// internal functions
function derive(byId: Record<ProblemId, Problem>) {
    const activeProblems = Object.values(byId)
        .filter(p => !p.deletedAt)    
    const ids = activeProblems.map(p => p.id)

    const tagSet = new Set<string>()
    activeProblems.forEach(p =>
        p.tags?.forEach(tag => tagSet.add(tag))
    )

    return {
        activeProblems, ids,
        allTags: Array.from(tagSet),
    }
}
function reduceById(byId: Record<ProblemId, Problem>) {
    return {
        byId,
        ...derive(byId),
    }
}


/////////////
export const useProblemStore = create<ProblemState>((set, get) => ({
    ids: [],
    byId: {},
    activeProblems: [],
    allTags: [],
   
    
    reload: async () => {       
        const data = await repository.load()
        const byId: Record<ProblemId, Problem> = {}
        //const ids: ProblemId[] = []

        data.forEach(p => {
            byId[p.id] = p
            //ids.push(p.id)
        })
        set(reduceById(byId))       
        
    },

    updateProblem: async(id, updater) => {
        await get().updateProblems([id], updater)
    },
    updateProblems: async (ids, updater) => {
        const state = get()

        const updated: Problem[] = []
        const newById = { ...state.byId }

        for (const id of ids) {
            const current = newById[id]
            if (!current) continue

            const next = current.withUpdated(updater)
            if (next !== current) {                
                newById[id] = next
                updated.push(next)
            }
        }

        if (updated.length === 0) return

        // ① all を再構築
        //const newAll = state.all.map(p =>
        //    newById[p.id] ?? p
        //)

        // ② 楽観的更新
        const prevState = state.byId
        set(reduceById(newById))

        // ③ 永続化
        try {
            await repository.updateMany(updated)
        } catch (e) {
            set(reduceById(prevState))
        }
    },

    toggleStar: async (id: ProblemId) => {
        await get().updateProblem(id, prev => prev.toggleStar())
    },
    deleteProblem: async (id: ProblemId) => {
        await get().deleteProblems([id])
    },

    deleteProblems: async (idsToDelete) => {
        const state = get()
        const newById = { ...state.byId }

        const updated: Problem[] = []

        for (const id of idsToDelete) {
            const current = newById[id]
            if (!current) continue

            const next = current.softDelete()
            newById[id] = next
            updated.push(next)
        }

        if (updated.length === 0) return

        set(reduceById(newById))

        await repository.updateMany(updated)
    },

    deleteAll: async () => {
        const state = get()
        const newById = { ...state.byId }
        const updated: Problem[] = []

        for (const id in newById) {
            const current = newById[id]
            if (current.deletedAt) continue

            const next = current.softDelete()
            newById[id] = next
            updated.push(next)
        }

        if (updated.length === 0) return

        set(reduceById(newById))
        await repository.updateMany(updated)
    }

,

}))