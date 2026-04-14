import type { ReviewEvent, ReviewReviewedEvent } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type MasteryLevel = | "unlearned" | "learning" | "mastered"
export const MasteryLevelTextMapping: Record<MasteryLevel, string> = {
    "unlearned": "未習熟",
    "learning": "習熟中",
    "mastered": "習熟済"

}
export type LearningQueue = "new" | "learn" | "relearn" | "review"
export const LearningStep = [1, 10, 60]


type LearningStats = {
    attemptCount: number
    solvedCount: number
    failedCount: number
}
type SchedulingState = {
    queue: LearningQueue
    intervalDays: number
    nextReviewedAt: number
    stepIndex: number
    easeFactor: number
}
type MasteryState = {
    masteryLevel: MasteryLevel
    score: number
}

export type LearningState = {
    stats: LearningStats,
    schedulingState: SchedulingState,

    masteryLevel: MasteryLevel,
    score: number,

    lastEvent?: ReviewReviewedEvent
}

export const DefaultLearningState: LearningState = {
    stats: {
        attemptCount: 0,
        solvedCount: 0,
        failedCount: 0,
    },
    schedulingState: {
        intervalDays: 0,
        nextReviewedAt: Date.now(),
        easeFactor: 2.5,

        queue: "new",
        stepIndex: 0,
    },
    masteryLevel: "unlearned",
    score: 0,

    //lastAnsweredAt: undefined,
    //lastSolvedResult: undefined,
}

