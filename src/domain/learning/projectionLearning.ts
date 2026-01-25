import type { LearningEvent } from "@/domain/LearningEvent"
import { Learning, type LearningRecord } from "@/domain/learning/Learning"
import type { SolvedResult } from "../MissionEvent/MissionSummary"


const MAX_INTERVAL_DAYS = 60
const DAY = 60 * 60 * 24 * 1000

export function projectLearning(
    events: readonly LearningEvent[]
): LearningRecord {
    const record: LearningRecord = {}
    console.log("project learning for events", events)
    for (const event of events) {
        ///console.log("project learning", event)
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

    let easeFactor = base.easeFactor
    let intervalDays = base.intervalDays
    let solvedCnt = base.solvedCount
    let failedCnt = base.failedCount
    const quality = judgeAnswerQuality(event.quality)

    if (event.quality === "failed") {
        failedCnt++
        intervalDays = 1
        easeFactor = Math.max(1.3, easeFactor - 0.2)
    } else {
        solvedCnt++
        if (intervalDays === 0) intervalDays = 1
            else if (intervalDays === 1) intervalDays = 3
            //else intervalDays = Math.round(intervalDays * easeFactor)
            else intervalDays = Math.min(Math.round(intervalDays * easeFactor), MAX_INTERVAL_DAYS)
    }
    easeFactor = Math.max(
            1.3,
             easeFactor + 0.1 - (3 - quality) * 0.05
            //easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
        )

    const nextReviewAt = event.at + intervalDays * DAY
    //console.log("event", event)
    //console.log("apply reviewed event", new Date(nextReviewAt).toLocaleDateString(), intervalDays)

    return new Learning(
        event.problemId, solvedCnt, failedCnt, intervalDays,
        nextReviewAt, easeFactor, event.at, event.quality
    )
}
    // 正解評価
    function judgeAnswerQuality(answer: SolvedResult, sec: number = 10): number {
        if (answer === "failed") return 0
        if (sec < 10) return 5
        return 2
    }