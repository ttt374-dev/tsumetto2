import { calculateScore } from "@/domain/learning/service/calculateScore"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type LearningState = {
    attemptCount: number,
    failedCount: number,
    score: number,
    intervalDays: number,
    nextReviewedAt: number,
    easeFactor: number,
}

export const DefaultLearningState: LearningState = {
    attemptCount: 0,
    failedCount: 0,
    score: 0,
    intervalDays: 0,
    nextReviewedAt: Date.now(),
    easeFactor: 2.5,
}

