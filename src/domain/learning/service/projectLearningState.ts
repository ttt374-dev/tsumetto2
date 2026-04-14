import { deriveAnswerQuality } from "@/domain/learning/entity/AnswerQuality"
import { createDefaultLearningState, LearningStep, type LearningState, type LearningStats, type SchedulingState } from "@/domain/learning/entity/LearningState"
import { calculateScore } from "@/domain/learning/service/calculateScore"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEvent, ReviewReviewedEvent } from "@/domain/review/ReviewEvent"

export function projectLearningState(events: ReviewEvent[]): Record<ProblemId, LearningState> {
    const records: Record<ProblemId, LearningState> = {}
    const sorted = [...events].sort((a, b) => a.at - b.at)
    for (const event of sorted) {
        const pid = event.problemId
        switch (event.type) {
            case "reviewed": {
                const prev = records[pid] ?? createDefaultLearningState()                 
                records[pid] = applyReviewedEvent(prev, event)
                break
            }
            case "reset": {
                // 👇 その problem だけ初期化
                records[pid] = createDefaultLearningState()
                break;
            }
        }
    }
    return records
}
///////////////////////////////////////////////
const MAX_INTERVAL_DAYS = 60

function applyReviewedEvent(prev: LearningState, lastEvent: ReviewReviewedEvent): LearningState {   
    const quality = deriveAnswerQuality(lastEvent.solvedResult)
    const stats = updateStats(prev.stats, quality)
    const schedulingState = schedule(prev.schedulingState, quality, lastEvent.at)

    const newScore = calculateScore(lastEvent.solvedResult)
    const score = updateAverage(prev.stats.attemptCount, prev.score, newScore).averageScore

    return {
        stats,
        schedulingState,
        score,
        lastEvent,
    }
}
//////////////////////////////////
// helper
function updateAverage(
    prevAttemptCount: number,
    averageScore: number,
    newScore: number
) {
    const newAttemptCount = prevAttemptCount + 1

    const newAverage = newAttemptCount > 0 ? (averageScore * prevAttemptCount + newScore) / newAttemptCount : 0

    return {
        attemptCount: newAttemptCount,
        averageScore: newAverage,
    }
}
function updateStats(prev: LearningStats, quality: number): LearningStats {
    const isCorrect = quality >= 3

    return {
        attemptCount: prev.attemptCount + 1,
        solvedCount: prev.solvedCount + (isCorrect ? 1 : 0),
        failedCount: prev.failedCount + (isCorrect ? 0 : 1),
    }
}

function schedule(prev: SchedulingState, quality: number, now: number): SchedulingState {
    let { intervalDays, stepIndex, queue, easeFactor } = prev
    let nextReviewedAt = prev.nextReviewedAt

    if (queue === "new") {
        queue = "learn"
    }
    easeFactor = Math.max(
        1.3,
        easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    )

    if (quality <= 2) {
        intervalDays = 1
        stepIndex = 0
        if (queue === "review") queue = "relearn"
        nextReviewedAt = now + LearningStep[0] * 60 * 1000       
        
    } else {
        if (stepIndex + 1 < LearningStep.length) {
            nextReviewedAt = now + LearningStep[stepIndex] * 60 * 1000
            stepIndex++
        } else {
            queue = "review"
            intervalDays =
                intervalDays < 1 ? 1 :
                    intervalDays === 1 ? 3 :
                        Math.min(Math.round(intervalDays * easeFactor), MAX_INTERVAL_DAYS)
            nextReviewedAt = now + intervalDays * 86400000
        }
    }

    return {
        queue,
        stepIndex,
        intervalDays,
        easeFactor,
        nextReviewedAt,
    }
}