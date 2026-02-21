import type { FilterState } from "../problem/query/filter"
import type { SortState } from "../problem/query/sort"
import type { useQuery } from "@/application/useQuery"

export type QuerySnapshot = {
  filterState: FilterState
  sortState: SortState
}
export type DeckId = string

export type Deck = {
  id: DeckId
  name: string
  snapshot: QuerySnapshot
  order: number
  
  createdAt: number //  Date
}
export function createQuerySnapshot(query: ReturnType<typeof useQuery>): QuerySnapshot {
  return {
    filterState: structuredClone(query.filterState),
    sortState: structuredClone(query.sortState)
  }
}

