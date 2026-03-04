import type { QueryState } from "@/domain/problem/service/query/ProblemsQuery"

export type QuerySnapshot = {
  queryState: QueryState,
  //filterState: FilterState
  //sortState: SortState
}
export type DeckId = string

export type Deck = {
  id: DeckId
  name: string
  snapshot: QuerySnapshot
  order: number
  
  createdAt: number //  Date
}
export function createQuerySnapshot(queryState: QueryState): QuerySnapshot {
  return {
    queryState: structuredClone(queryState)
    //filterState: structuredClone(filterState),
    //sortState: structuredClone(sortState)
  }
}

