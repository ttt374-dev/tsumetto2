import type { LearningEvent } from "@/domain/LearningEvent"
import { Learning, type LearningRecord } from "@/domain/learning/Learning"
import type { ProblemId } from "@/domain/problem/Problem"

const DAY = 60 * 60 * 24

export function projectLearning(
    events: readonly LearningEvent[]
): LearningRecord {
    const record: LearningRecord = {}

    for (const event of events) {
        if (event.type !== "reviewed") continue

        const prev = record[event.problemId] ?? Learning.create(event.problemId)
        record[event.problemId] = applyReviewedEvent(prev, event)
    }

    return record
}
function applyReviewedEvent(
    prev: Learning,
    event: LearningEvent
): Learning {
    const base = prev

    let ef = base.easeFactor
    let interval = base.intervalDays
    let solvedCnt = base.solvedCount
    let failedCnt = base.failedCount

    if (event.quality === "failed") {
        failedCnt++
        interval = 1
        ef = Math.max(1.3, ef - 0.2)
    } else {
        solvedCnt++
        //ef = ef
        interval =
            interval === 1
                ? 1
                : Math.round(interval * ef)
    }

    const nextReviewAt = event.at + interval * DAY

    return new Learning(
        event.problemId, solvedCnt, failedCnt, interval,
        nextReviewAt, ef, event.at, event.quality
    )
}
