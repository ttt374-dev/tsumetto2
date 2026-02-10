import type { useMissionQueryContext } from "@/ui/App/providers/QueryProvider"
import type { FilterState } from "../problem/query/filter"

export type FilterSnapshot = {
  filterState: FilterState
  // 将来用
  // order?: ProblemOrder
  // limit?: number
}
export type Deck = {
  id: string
  name: string
  snapshot: FilterSnapshot
  createdAt: Date
}
export function createFilterSnapshot(query: ReturnType<typeof useMissionQueryContext>): FilterSnapshot {
  return {
    filterState: structuredClone(query.filterState)
  }
}

export const DEFAULT_DECK_ID = "default-id"
export const DEFAULT_DECK_NAME = "default"

