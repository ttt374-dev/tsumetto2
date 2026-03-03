import type { ProblemType } from "../../entity/Problem";

export type FilterState = {
    text?: string;
    unansweredOnly: boolean;    
    problemType?: ProblemType;
    source?: string,
    dueForReviewOnly: boolean,
    starredOnly: boolean,
    tags?: string[],

    //mateLength?: MateLengthFilter
    mateBuckets?: MateBucket[]

};

export const DefaultFilterState: FilterState = {
    text: "",
    unansweredOnly: false,
    problemType: "standard",
    source: "",
    dueForReviewOnly: false,
    starredOnly: false,
}

/*

export type MateLengthFilter = {
    length: 3 | 5 | 7 | 9
    mode: "eq" | "lte" | "gte" 
}
*/

export type MateBucket =
    | "lte3"
    | "eq5"
    | "eq7"
    | "gte9"