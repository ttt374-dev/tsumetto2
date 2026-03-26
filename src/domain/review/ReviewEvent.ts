import type { SessionId } from "@/domain/session/entity/Session"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type ReviewAction = 
    | { type: "mistake", ply: number, elapsedSec: number}
    | { type: "reveal", ply: number, elapsedSec: number }
    | { type: "abandon", ply: number, elapsedSec: number}

export type ReviewEventId = string

export type NewReviewEvent =
    | NewReviewReviewedEvent
    | NewReviewResetEvent
    //| NewReviewCancelEvent

type NewReviewReviewedEvent =
    {
        type: "reviewed"
        problemId: ProblemId
        sessionId: SessionId
        solvedResult: SolvedResult
        actions: ReviewAction[]
    }

type NewReviewResetEvent =
    {
        type: "reset"
        problemId: ProblemId
    }

/*
type NewReviewCancelEvent =
    {
        type: "cancel"
        targetEventId: ReviewEventId
        problemId: ProblemId
        sessionId: SessionId
        
    }
*/
export type ReviewEvent =
    NewReviewEvent & { id: ReviewEventId, at: number }

export type ReviewReviewedEvent = Extract<ReviewEvent, { type: "reviewed" }>;

export type ReviewEventLog = ReviewEvent[]
