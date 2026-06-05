import { create } from "zustand"
import { createSelector } from "reselect"

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"

///////////////////
// selector
export const selectActiveProblems = createSelector(
    (s: ProblemState) => s.byId,
    (byId) => Object.values(byId).filter(p => !p.deletedAt)
)
export const selectActiveProblemIdSet = createSelector(
    (s: ProblemState) => s.byId,
    (byId) => {
        const set = new Set<string>()
        for (const p of Object.values(byId)) {
            if (!p.deletedAt) {
                set.add(p.id)
            }
        }
        return set
    }
)
/*
export const selectAllTags = (s: ProblemState): string[] => {
    const set = new Set<string>()
    Object.values(s.byId).forEach(p => {
        if (p.deletedAt) return
        p.tags?.forEach(tag => set.add(tag))
    })
    return Array.from(set)
}

export const selectAllSources = (s: ProblemState): string[] => {
    const set = new Set<string>()
    Object.values(s.byId).forEach(p => {
        if (p.deletedAt) return
        const src = p.source
        if (src && src.trim() !== "") set.add(src)
    })
    return Array.from(set)
}

*/
/////////////////////////
export type ProblemState = {
    repo?: ProblemRepository
    setRepository: (repo: ProblemRepository) => void
    byId: Record<ProblemId, Problem>   // SoT

    // derived states
    ids: ProblemId[]
    allTags: string[]
    allSources: string[]
    activeProblems: Problem[]
    exisistingProblems: Problem[]

    reload: () => Promise<void>
    //save: () => Promise<void>

    replaceAll: (problems: Problem[]) => void
    patchProblem: (id: ProblemId, next: Problem) => void

    //updateProblem: (id: ProblemId, updater: (p: Problem) => Problem) => Promise<void>
    //updateProblems: (ids: string[], updater: (p: Problem) => Problem) => Promise<void>
    //deleteProblem: (id: ProblemId) => Promise<void>
    //deleteProblems: (ids: ProblemId[]) => Promise<void>
    //toggleStar: (id: ProblemId) => Promise<void>
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
    const exisistingProblems = Object.values(byId)
    const sourceSet = new Set(
        activeProblems
            .map(p => p.source)
            .filter((s): s is string => !!s && s.trim() !== "")
    )
    return {
        activeProblems, ids,
        exisistingProblems,
        allTags: Array.from(tagSet),
        allSources: Array.from(sourceSet)
    }
}
function reduceById(byId: Record<ProblemId, Problem>) {
    console.log("problem repo reducer", byId)
    return {
        byId,
        ...derive(byId),
    }
}

/////////////
export const useProblemStore = create<ProblemState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),

    // derived values
    ids: [],
    byId: {},
    activeProblems: [],
    exisistingProblems: [],
    allTags: [],
    allSources: [],

    reload: async () => {
        const repo = ensureRepo(get().repo)
        const data = await repo.findAll()
        const byId: Record<ProblemId, Problem> = {}

        data.forEach(p => {
            byId[p.id] = p
        })
        console.log("problem store reload", byId)
        set(reduceById(byId))
    },
    /*
    save: async () => {
        const repo = ensureRepo(get().repo)
        await repo.replaceAll(Object.values(get().byId))
    },*/
     replaceAll: (problems) => {
        const byId: Record<
            ProblemId,
            Problem
        > = {}

        for (const p of problems) {
            byId[p.id] = p
        }
        set(reduceById(byId))
    },

    patchProblem: (id, next) => {
        set(state =>
            reduceById({
                ...state.byId,
                [id]: next
            })
        )
    },
    
    /*
    updateProblem: async (id, updater) => {
        const repo = ensureRepo(get().repo)
        const state = get()
        const current = state.byId[id]
        if (!current) return

        const next = updater(current)
        if (next === current) return

        // optimistic update
        set(state => reduceById({
            ...state.byId,
            [id]: next
        }))

        try {
            await repo.update(next)
        } catch (e) {
            console.error(e)
            // rollback
            //set(state)
            set(reduceById(state.byId))
            throw e
        }
    },
    updateProblems: async (ids, updater) => {
        for (const id of ids) {
            await get().updateProblem(id, updater)
        }
    },
    toggleStar: async (id: ProblemId) => {
        await get().updateProblem(id, prev => prev.toggleStar())
    },
    deleteProblem: async (id: ProblemId) => {
        const repo = ensureRepo(get().repo)
        const state = get()
        const current = state.byId[id]
        if (!current) return
        const next = current.softDelete()

        // no-op
        if (next === current) return

        // optimistic update
        set(reduceById({
            ...state.byId,
            [id]: next,
        }))

        try {
            await repo.update(next)
        } catch (e) {
            console.error(e)
            // rollback
            set(reduceById(state.byId))
            throw e
        }
    },
    deleteProblems: async (ids: ProblemId[]) => {
        for (const id of ids) {
            await get().deleteProblem(id)
        }
    },    
    */

}))
/////////////////////
function ensureRepo(repo: ProblemRepository | undefined): ProblemRepository {
    if (!repo) {
        throw new Error(
            "ProblemRepository not initialized"
        )
    }

    return repo
}