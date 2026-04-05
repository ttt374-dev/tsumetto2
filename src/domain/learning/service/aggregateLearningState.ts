import { DefaultLearningState, type LearningState } from "@/domain/learning/entity/LearningState"

///////////////////////////////////////////////////
export function aggregateLearningStates(
    record: Record<string, LearningState>
): LearningState {
    const values = Object.values(record)
    if (values.length === 0) return {...DefaultLearningState}

    let totalAttempt = 0
    let totalFailed = 0
    let weightedScoreSum = 0
    let intervalSum = 0
    let easeFactorSum = 0
    let nextReviewedAtMin = Infinity

    for (const s of values) {
        totalAttempt += s.attemptCount
        totalFailed += s.failedCount

        weightedScoreSum += s.score * s.attemptCount

        intervalSum += s.intervalDays
        easeFactorSum += s.easeFactor

        if (s.nextReviewedAt < nextReviewedAtMin) {
            nextReviewedAtMin = s.nextReviewedAt
        }
    }

    const count = values.length

    return {
        attemptCount: totalAttempt,
        failedCount: totalFailed,
        score: totalAttempt === 0 ? 0 : weightedScoreSum / totalAttempt,
        intervalDays: intervalSum / count,
        nextReviewedAt: nextReviewedAtMin,
        easeFactor: easeFactorSum / count,
    }
}