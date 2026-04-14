import type { ReviewReviewedEvent } from "@/domain/review/ReviewEvent"

export type MasteryStatus = | "unlearned" | "learning" | "young" | "matured" | "relearning"
export const MasteryLevelTextMapping: Record<MasteryStatus, string> = {
    "unlearned": "未習熟",
    "learning": "習熟中",
    "matured": "復習（習熟期）",
    "young": "復習（未習熟期）",
    "relearning": "再習得中"

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

export type LearningState = {
    stats: LearningStats,
    schedulingState: SchedulingState,
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
    score: 0,

    lastEvent: undefined,
}

export function getLearningStatus(state: LearningState): MasteryStatus{
    switch(state.schedulingState.queue){
        case "new":
            return "unlearned"
        case "learn":
            return "learning"
        case "review":
            if (state.schedulingState.intervalDays < 21)
                return "young"
            else
                return "matured"
        case "relearn":
            return "relearning"
    }
}