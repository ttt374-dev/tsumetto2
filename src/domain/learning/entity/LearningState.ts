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

