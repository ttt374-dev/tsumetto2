// application/store/problemStore.ts
import { create } from "zustand"
import type { ProblemRepository } from "../../domain/problem/ProblemRepository"
import type { Problem, ProblemId } from "../../domain/problem/Problem"

export type ProblemState = {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>    
    all: Problem[]

    //getAllProblems: () => Problem[]

    reload: () => Promise<void>
    setProblems: (problems: Problem[]) => void
  //addProblem: (problem: Problem) => void
    updateProblem: (p: Problem) => Promise<void>
    deleteProblems: (ids: ProblemId[]) => Promise<void>
    deleteAll: () => Promise<void>
}

let repository: ProblemRepository

export const initProblemStore = (repo: ProblemRepository) => {
    repository = repo
}

export const useProblemStore = create<ProblemState>((set, get) => ({
    ids: [],
    byId: {},
    all: [],

    reload: async () => {
        try {
            const data = await repository.load()

            const byId: Record<ProblemId, Problem> = {}
            const ids: ProblemId[] = []

            for (const p of data) {
                byId[p.id] = p
                ids.push(p.id)
            }            
          

            set({ ids, byId, all: data })
        } catch {
            set({ ids: [], byId: {}, all: [] })
        }
    },

    setProblems: (problems) => {
        const byId: Record<string, Problem> = {}
        const ids: string[] = []

        for (const p of problems) {
            byId[p.id] = p
            ids.push(p.id)
        }

        set({
            ids,
            byId,
            all: problems, // ← ここが重要
        })
    },

    updateProblem: async (problem) => {
        await repository.update(problem)

        set((prev) => ({
            byId: {
                ...prev.byId,
                [problem.id]: problem,
            },
        }))
    },

    deleteProblems: async (idsToDelete) => {
        await repository.removeMany(idsToDelete)

        const deleteSet = new Set(idsToDelete)

        set((prev) => {
            const newById = { ...prev.byId }
            deleteSet.forEach((id) => delete newById[id])

            return {
                ids: prev.ids.filter((id) => !deleteSet.has(id)),
                byId: newById,
            }
        })
    },

    deleteAll: async () => {
        await repository.removeAll()
        set({ ids: [], byId: {} })
    },
}))



/*
import { useState, useEffect, useMemo } from "react";
import type { ProblemRepository } from "../../domain/problem/ProblemRepository";
import type { Problem, ProblemId } from "../../domain/problem/Problem";

type ProblemState = {
  ids: ProblemId[]
  byId: Record<ProblemId, Problem>
//allTags: string[]
}


export function useProblemStoreOld(repository: ProblemRepository) {
    //const [problems, setProblems] = useState<Problem[]>([]);

    const [state, setState] = useState<ProblemState>({
        ids: [],
        byId: {},
        //allTags: []
    })


    const reload = async () => {
        try {
            const data = await repository.load()
            const byId: Record<ProblemId, Problem> = {}
            const ids: ProblemId[] = []

            for (const p of data) {
                byId[p.id] = p
                ids.push(p.id)
            }
            setState({ ids, byId })
        } catch {
            setState({ ids: [], byId: {} })
        }
    }

    // 初期ロード
    useEffect(() => {
        reload()  // .catch(() => setProblems([]));

    }, [repository]);

    const findById = (pid: ProblemId): Problem | undefined => {
        return state.byId[pid]
    }

    const allTags = useMemo(() => {
        const tagSet = new Set<string>()

        for (const id of state.ids) {
            const problem = state.byId[id]
            if (!problem) continue
            problem.tags.forEach(tag => tagSet.add(tag))
        }


        return Array.from(tagSet)
    }, [state.ids, state.byId])


    // --- commands ---
    const updateProblem = async (problem: Problem) => {
        await repository.update(problem)

        setState((prev) => ({
            ...prev,
            byId: {
                ...prev.byId,
                [problem.id]: problem,
            },
        }))
    }

    const deleteProblems = async (idsToDelete: ProblemId[]) => {
        await repository.removeMany(idsToDelete)

        const deleteSet = new Set(idsToDelete)

        setState((prev) => {
            const newById = { ...prev.byId }
            deleteSet.forEach((id) => delete newById[id])

            return {
                ids: prev.ids.filter((id) => !deleteSet.has(id)),
                byId: newById,
            }
        })
    }

    const deleteAll = async () => {
        await repository.removeAll()
        setState({
            ids: [],
            byId: {},
        })
    }

    return {
        // query
        //problems,
        ids: state.ids,
        reload,
        findById,
        allTags,

        // command
        updateProblem,
        deleteProblems,
        deleteAll,
    }
}
*/