import type { MissionId } from "@/domain/mission/entity/Mission"
import type { ProblemId } from "../../problem/entity/Problem"
import type { SolvedResult } from "./Learning"

export type LearningEventId = string

export type LearningEventType =
    | "reviewed"
    | "reset"
    | "cancel"

type LearningEventBase<T extends LearningEventType> = {
    type: T
    missionId: MissionId
}
export type NewLearningEvent =
    | NewLearningReviewedEvent
    | NewLearningResetEvent
    | NewLearningCancelEvent

type NewLearningReviewedEvent =
    LearningEventBase<"reviewed"> & {
        problemId: ProblemId
        quality: SolvedResult
        sec?: number
    }

type NewLearningResetEvent =
    LearningEventBase<"reset"> & {
        problemId: ProblemId
    }

type NewLearningCancelEvent =
    LearningEventBase<"cancel"> & {
        targetEventId: LearningEventId
    }

export type LearningReviewedEvent = NewLearningReviewedEvent & { at: number }

export type LearningEvent =
    NewLearningEvent & { id: LearningEventId, at: number }
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
