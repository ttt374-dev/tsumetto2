import type { SolvedResult } from "../learning/Learning"
import type { ProblemId } from "../problem/Problem"

export type LearningEvent =
    LearningReviewEvent
    | {
        type: "reset"
        problemId: ProblemId
        at: number
    }
export type LearningReviewEvent = {
        type: "reviewed"
        problemId: ProblemId
        quality: SolvedResult
        sec?: number
        at: number
    } 

/*
export type LearningEvent = 
    | {
    type: "reviewed"
    problemId: ProblemId
    quality: SolvedResult
    sec?: number
    at: number
}
    */

export type LearningEventLog = LearningEvent[]
