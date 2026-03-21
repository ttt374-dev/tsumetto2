import type { SessionId } from "@/domain/session/entity/Session"
import type { ProblemId } from "../../problem/entity/Problem"
import type { SolvedResult } from "./Learning"

export type LearningEventId = string

export type NewLearningEvent =
    | NewLearningReviewedEvent
    | NewLearningResetEvent
    | NewLearningCancelEvent

type NewLearningReviewedEvent =
    {
        type: "reviewed"
        problemId: ProblemId
        sessionId: SessionId
        solvedResult: SolvedResult     
    }

type NewLearningResetEvent =
    {
        type: "reset"
        problemId: ProblemId
    }

type NewLearningCancelEvent =
    {
        type: "cancel"
        targetEventId: LearningEventId
        problemId: ProblemId
        sessionId: SessionId
        
    }

export type LearningEvent =
    NewLearningEvent & { id: LearningEventId, at: number }

export type LearningReviewedEvent = Extract<LearningEvent, { type: "reviewed" }>;

export type LearningEventLog = LearningEvent[]
