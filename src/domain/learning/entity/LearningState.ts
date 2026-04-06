import type { SolvedResult } from "@/domain/review/solvedResult"

export type LearningState = {
    attemptCount: number,
    solvedCount: number,
    failedCount: number,
    score: number,
    intervalDays: number,
    nextReviewedAt: number,
    easeFactor: number,

    lastAnsweredAt?: number,
    lastSolvedResult?: SolvedResult
}

export const DefaultLearningState: LearningState = {
    attemptCount: 0,
    solvedCount: 0,
    failedCount: 0,
    score: 0,
    intervalDays: 0,
    nextReviewedAt: Date.now(),    
    easeFactor: 2.5,

    //lastAnsweredAt: undefined,
    //lastSolvedResult: undefined,
}

