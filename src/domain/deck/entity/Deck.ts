import type { FilterState } from "@/domain/problem/service/query/filter"
import type { QueryState } from "@/domain/problem/service/query/ProblemsQuery"
import type { SortState } from "@/domain/problem/service/query/sort"
import type { useQuery } from "@/ui/common/hooks/useQuery"

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

