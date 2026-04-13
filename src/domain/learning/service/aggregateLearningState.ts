import { DefaultLearningState, type LearningState } from "@/domain/learning/entity/LearningState"

///////////////////////////////////////////////////
export function aggregateLearningStates(
    record: Record<string, LearningState>
): LearningState {
    const values = Object.values(record)
    if (values.length === 0) return {...DefaultLearningState}

    let attemptCount = 0
    let solvedCount = 0
    let failedCount = 0
    let weightedScoreSum = 0
    let intervalSum = 0
    let easeFactorSum = 0
    let nextReviewedAtMin = Infinity

    for (const s of values) {
        attemptCount += s.attemptCount
        solvedCount += s.solvedCount
        failedCount += s.failedCount

        weightedScoreSum += s.score * s.attemptCount

        intervalSum += s.intervalDays
        easeFactorSum += s.easeFactor

        if (s.nextReviewedAt < nextReviewedAtMin) {
            nextReviewedAtMin = s.nextReviewedAt
        }
    }

    const count = values.length
    const score = attemptCount === 0 ? 0 : weightedScoreSum / attemptCount

    return {
        attemptCount, solvedCount, failedCount,
        score,
        intervalDays: intervalSum / count,
        nextReviewedAt: nextReviewedAtMin,
        easeFactor: easeFactorSum / count,
        masteryLevel: "learning"
    }
}