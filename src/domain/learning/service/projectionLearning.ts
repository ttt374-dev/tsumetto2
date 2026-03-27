import { Learning, type LearningRecord} from "../entity/Learning"
import type { ReviewEvent, ReviewEventId, ReviewReviewedEvent} from "../../review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"

const MAX_INTERVAL_DAYS = 60
const DAY = 60 * 60 * 24 * 1000
export function projectLearning(
    events: readonly ReviewEvent[]
): LearningRecord {

    const record: LearningRecord = {}

    const canceled = new Set<ReviewEventId>()
    const sorted = [...events].sort((a, b) => a.at - b.at)
    // ① cancel対象を集める
    /*
    for (const e of sorted) {
        if (e.type === "cancel") {
            canceled.add(e.targetEventId)
        }
    }*/
    for (const event of sorted) {
        //if (event.type === "cancel") continue
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
    event: ReviewReviewedEvent
): Learning {    
    const base = prev    

    let easeFactor = base.easeFactor
    let intervalDays = base.intervalDays
    let solvedCnt = base.solvedCount
    let failedCnt = base.failedCount
    const quality = judgeAnswerQuality(event.solvedResult)

    if (event.solvedResult.outcome === "failed") {
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
        //easeFactor + 0.1 - (3 - quality) * 0.05
        easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
    )

    const nextReviewAt = event.at + intervalDays * DAY
    //console.log("event", event)
    //console.log("apply reviewed event", new Date(nextReviewAt).toLocaleDateString(), intervalDays)

    return new Learning(
        event.problemId, solvedCnt, failedCnt, intervalDays,
        nextReviewAt, easeFactor, event.at, event.solvedResult
    )
}
// 正解評価
function judgeAnswerQuality(solvedResult: SolvedResult): number {
    if (solvedResult.outcome === "failed") return 0    
    if (solvedResult.mistakes > 1) return 2
    if (solvedResult.elapsedSec > 10 ) return 4
    return 5
}