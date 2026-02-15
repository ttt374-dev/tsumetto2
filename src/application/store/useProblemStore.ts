// application/store/problemStore.ts
import { create } from "zustand"
import type { ProblemRepository } from "../../domain/problem/ProblemRepository"
import type { Problem, ProblemId } from "../../domain/problem/Problem"

export type ProblemState = {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>
    all: Problem[]
    allTags: string[]

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

  updateProblem: async (problem) => {
    await repository.update(problem)
    set((prev) => {
      const newAll = prev.all.map(p => p.id === problem.id ? problem : p)
      return {
        byId: { ...prev.byId, [problem.id]: problem },
        all: newAll,
        allTags: extractTags(newAll),
      }
    })
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