import type { QueryState } from "@/domain/problem/service/query/QueryState"

export type QuerySnapshot = {
  queryState: QueryState,
  //filterState: FilterState
  //sortState: SortState
}
export type MissionId = string

export type Mission = {
  id: MissionId
  name: string
  

  queryState: QueryState
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

