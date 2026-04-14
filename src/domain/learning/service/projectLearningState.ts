
import { deriveAnswerQuality } from "@/domain/learning/entity/AnswerQuality"
import { DefaultLearningState, LearningStep, type LearningState, type MasteryLevel } from "@/domain/learning/entity/LearningState"
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

function applyReviewedEvent(prev: LearningState, event: ReviewEvent): LearningState {
    if (event.type !== "reviewed") return prev

    //let easeFactor: number
    let intervalDays = prev.intervalDays
    let solvedCount = prev.solvedCount
    let failedCount = prev.failedCount
    let stepIndex = prev.stepIndex
    let queue = prev.queue
    //let masteryLevel = prev.masteryLevel
    let nextReviewedAt = prev.nextReviewedAt

    const quality = deriveAnswerQuality(event.solvedResult)
    const easeFactor = Math.max(
        1.3,
        //easeFactor + 0.1 - (3 - quality) * 0.05
        prev.easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    )
    if (quality <= 2) { // 失敗
        failedCount++
        intervalDays = 1
        stepIndex = 0
        if (queue === "review") queue = "relearn"
        stepIndex = 0
        //easeFactor = Math.max(1.3, prev.easeFactor - 0.2)
        
    } else {
        solvedCount++
        //if (prev.lastAnsweredAt && (event.at - prev.lastAnsweredAt) < 60 * 10 * 1000){
        if (stepIndex + 1 < LearningStep.length){            
            nextReviewedAt += LearningStep[stepIndex] * 60 * 1000
            stepIndex++
        } else {
            queue = "review"
            intervalDays =
                (intervalDays < 1) ? 1 :
                    (intervalDays === 1) ? 3 :
                        Math.min(Math.round(intervalDays * prev.easeFactor), MAX_INTERVAL_DAYS)
            nextReviewedAt = event.at + intervalDays * 60 * 60 * 24 * 1000
        }
    }

    //const nextReviewedAt = event.at + intervalDays * DAY
    const newScore = calculateScore(event.solvedResult)
    const score = updateAverage(prev.attemptCount, prev.score, newScore).averageScore

    //console.log("last answeredat", event.at)
    // mastered
    let masteryLevel = prev.masteryLevel
    if (intervalDays > 7 && easeFactor > 2.5){
        masteryLevel = "mastered"
    } else {
        masteryLevel = "learning"
    }

    return {
        attemptCount: prev.attemptCount + 1,
        solvedCount, failedCount,
        score, easeFactor,
        nextReviewedAt,
        intervalDays,

        queue, stepIndex,
        masteryLevel,
        lastEvent: event,
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