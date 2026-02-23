import type { ProblemId } from "../../problem/entity/Problem"
import type { SolvedResult } from "./Learning"

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
