import { Learning, type LearningRecord, type SolvedResult } from "../entity/Learning"
import type { LearningEvent, LearningEventId, LearningReviewedEvent } from "../entity/LearningEvent"

const MAX_INTERVAL_DAYS = 60
const DAY = 60 * 60 * 24 * 1000
export function projectLearning(
    events: readonly LearningEvent[]
): LearningRecord {

    const record: LearningRecord = {}

    const canceled = new Set<LearningEventId>()

    // ① cancel対象を集める
    for (const e of events) {
        if (e.type === "cancel") {
            canceled.add(e.targetEventId)
        }
    }
    for (const event of events) {
        if (event.type === "cancel") continue
        if (canceled.has(event.id)) continue

        switch (event.type) {
            case "reviewed": {
                const prev =
                    record[event.problemId] ??
                    Learning.create(event.problemId)

                record[event.problemId] =
                    applyReviewedEvent(prev, event)
                break
            }           
            case "reset": {
                // 👇 その problem だけ初期化
                record[event.problemId] =
                    Learning.create(event.problemId)
                break
            }
        }
    }

    return record
}


function applyReviewedEvent(
    prev: Learning,
    event: LearningReviewedEvent
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