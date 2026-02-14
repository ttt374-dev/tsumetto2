import type { ProblemState } from "./useProblemStore"


export const selectAllTags = (s: ProblemState): string[] => {
  //return [] // TODO
  const tags = new Set<string>()

  for (const id of s.ids) {
    s.byId[id]?.tags.forEach(tag => tags.add(tag))
  }

  return Array.from(tags)
}


