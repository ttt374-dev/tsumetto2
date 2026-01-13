import type { MissionItem } from "../MissionItem";
import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { FilterState } from "./filter";
import type { SortState } from "./sort";


export function applyQuery(missionItems: MissionItem[], 
    sortState?: SortState, filterState?: FilterState){

    const filtered = filterState ? applyFilter(missionItems, filterState) : missionItems
    return sortState ? applySort(filtered, sortState) : filtered   

}