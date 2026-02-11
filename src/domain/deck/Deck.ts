import type { FilterState } from "../problem/query/filter"
import type { SortState } from "../problem/query/sort"
import type { useQuery } from "@/application/useQuery"

export type QuerySnapshot = {
  filterState: FilterState
  sortState: SortState
  // 将来用
  // order?: ProblemOrder
  // limit?: number
}
export type DeckId = string
export type Deck = {
  id: DeckId
  name: string
  snapshot: QuerySnapshot
  
  createdAt: Date
}
export function createQuerySnapshot(query: ReturnType<typeof useQuery>): QuerySnapshot {
  return {
    filterState: structuredClone(query.filterState),
    sortState: structuredClone(query.sortState)
  }
}

//export const DEFAULT_DECK_ID = "default-id"
//export const DEFAULT_DECK_NAME = "default"


