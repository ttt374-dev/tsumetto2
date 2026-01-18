import type { Exercise } from "../Exercise";
import { applyFilter } from "./applyFilter";
import { applySort } from "./applySort";
import type { FilterState } from "./filter";
import type { SortState } from "./sort";


export function applyQuery(exerciseList: Exercise[], 
    sortState?: SortState, filterState?: FilterState){

    const filtered = filterState ? applyFilter(exerciseList, filterState) : exerciseList
    return sortState ? applySort(filtered, sortState) : filtered   

}