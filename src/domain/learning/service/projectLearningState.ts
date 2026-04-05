
import { deriveAnswerQuality } from "@/domain/learning/entity/AnswerQuality"
import { DefaultLearningState, type LearningState } from "@/domain/learning/entity/LearningState"
import { calculateScore } from "@/domain/learning/service/calculateScore"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"

export function projectLearningState(events: ReviewEvent[]): Record<ProblemId, LearningState> {
    const records: Record<ProblemId, LearningState> = {}
    const sorted = [...events].sort((a, b) => a.at - b.at)
    for (const event of sorted) {
        const pid = event.problemId
        switch (event.type) {
            case "reviewed": {
                const prev = records[pid] ??
                    { ...DefaultLearningState}
                records[pid] = applyReviewedEvent(prev, event)
                break
            }
            case "reset": {
                // 👇 その problem だけ初期化
                records[pid] = { ...DefaultLearningState }
                break;
            }
        }
    }
    return records
}
///////////////////////////////////////////////
const MAX_INTERVAL_DAYS = 60
const DAY = 60 * 60 * 24 * 1000

function applyReviewedEvent(prev: LearningState, event: ReviewEvent): LearningState {
    if (event.type !== "reviewed") return prev

    //let easeFactor: number
    let intervalDays = prev.intervalDays
    let solvedCount = prev.solvedCount
    let failedCount = prev.failedCount

    const quality = deriveAnswerQuality(event.solvedResult)

    if (quality <= 2) { // 失敗
        failedCount++
        intervalDays = 1
        //easeFactor = Math.max(1.3, prev.easeFactor - 0.2)
        
    } else {
        solvedCount++
        intervalDays =
            (intervalDays < 1) ? 1 :
                (intervalDays === 1) ? 3 :
                    Math.min(Math.round(intervalDays * prev.easeFactor), MAX_INTERVAL_DAYS)
    }
    const easeFactor = Math.max(
        1.3,
        //easeFactor + 0.1 - (3 - quality) * 0.05
        prev.easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    )
    const nextReviewedAt = event.at + intervalDays * DAY
    const newScore = calculateScore(event.solvedResult)
    const score = updateAverage(prev.attemptCount, prev.score, newScore).averageScore

    return {
        attemptCount: prev.attemptCount + 1,
        solvedCount, failedCount,
        score, easeFactor,
        nextReviewedAt,
        intervalDays,
        lastAnsweredAt: event.at        
    }
}
//////////////////////////////////
// helper
function updateAverage(
    attemptCount: number,
    averageScore: number,
    newScore: number
) {
    const newAttemptCount = attemptCount + 1

    const newAverage =
        (averageScore * attemptCount + newScore) / newAttemptCount

    return {
        attemptCount: newAttemptCount,
        averageScore: newAverage,
    }
}