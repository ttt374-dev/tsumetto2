import { create } from "zustand"
import type { Problem, ProblemId } from "../../domain/problem/entity/Problem"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"

///////////////////
// selector
export const selectActiveProblems = (s: ProblemState) =>
  Object.values(s.byId).filter(p => !p.deletedAt)

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
    
    reload: () => Promise<void>
    updateProblem: (id: ProblemId, updater: (p: Problem) => Problem) => void
    updateProblems: (ids: string[], updater: (p: Problem) => Problem) => void
    deleteProblem: (id: ProblemId) => void
    deleteProblems: (ids: ProblemId[]) => void
    toggleStar: (id: ProblemId) => void
    deleteAll: () => void
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
    const sourceSet = new Set(
        activeProblems
            .map(p => p.source)
            .filter((s): s is string => !!s && s.trim() !== "")
    )
    return {
        activeProblems, ids,
        allTags: Array.from(tagSet),
        allSources: Array.from(sourceSet)
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
    repo: undefined,
    setRepository: (repo) => set({ repo }),

    ids: [],
    byId: {},
    activeProblems: [],
    allTags: [],
    allSources: [],   
    
    reload: async () => {       
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")

        const data = await repo.load()
        const byId: Record<ProblemId, Problem> = {}

        data.forEach(p => {
            byId[p.id] = p
        })
        set(reduceById(byId))       
        
    },
    updateProblem: (id, updater) => {
        get().updateProblems([id], updater)
    },
    updateProblems: (ids, updater) => {
        const state = get()

        //const updated: Problem[] = []
        let changed = false
        const newById = { ...state.byId }

        for (const id of ids) {
            const current = newById[id]
            if (!current) continue

            //const next = current.withUpdated(updater)
            const next = updater(current)
            if (next !== current) {                
                newById[id] = next
                changed = true
                //updated.push(next)
            }
        }

        //if (updated.length === 0) return
        if (changed) return

        // ① all を再構築
        //const newAll = state.all.map(p =>
        //    newById[p.id] ?? p
        //)

        // ② 楽観的更新
        //const prevState = state.byId
        set(reduceById(newById))
    },

    toggleStar: (id: ProblemId) => {
        get().updateProblem(id, prev => prev.toggleStar())
    },
    deleteProblem: (id: ProblemId) => {
        get().deleteProblems([id])
    },

    deleteProblems: (idsToDelete) => {
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
    },

    deleteAll: () => {
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
    }
,

}))

/*
/////////////////////////////////////////////////////////
export const initProblemStore = (repo: ProblemRepository) => {
    repository = repo

    const saveRepo = debounce(async (problems: Problem[]) => {
        try {
            await repository.replaceAll(problems)
        } catch (e) {
            console.error("Failed to save problems", e)
        }
    }, 1000) // 1秒ごとにまとめて書き出し


    let isInitializing = true
    useProblemStore.subscribe(state => {
        if (isInitializing) return
        const allProblems = Object.values(state.byId)
        saveRepo(allProblems)
    })
    // 初期ロード完了後にフラグを解除
    isInitializing = false
}*/