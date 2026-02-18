import type { SolvedResult } from "../learning/Learning"
import type { ProblemId } from "../problem/Problem"

export type NewLearningEvent =
    | NewLearningReviewedEvent
    | NewLearningResetEvent

type NewLearningReviewedEvent = {
    type: "reviewed"
    problemId: ProblemId
    quality: SolvedResult
    sec?: number
    //at: number
}
type NewLearningResetEvent = {
    type: "reset"
    problemId: ProblemId
    //at: number
}

export type LearningReviewedEvent = NewLearningReviewedEvent & { at: number }

export type LearningEvent =
    NewLearningEvent & { at: number }
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
