import type { ReviewReviewedEvent } from "@/domain/review/ReviewEvent"

export type MasteryStatus = | "unlearned" | "learning" | "young" | "matured" | "relearning"
export type LearningQueue = "new" | "learn" | "relearn" | "review"
export const LearningStep = [1, 10, 60*12]

export type LearningStats = {
    attemptCount: number
    solvedCount: number
    failedCount: number
}
export type SchedulingState = {
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
//////////////////////////////////////
export function createDefaultLearningState(now: number = Date.now()): LearningState {
    return {
        stats: {
            attemptCount: 0,
            solvedCount: 0,
            failedCount: 0,
        },
        schedulingState: {
            intervalDays: 0,
            nextReviewedAt: now,
            easeFactor: 2.5,

            queue: "new",
            stepIndex: 0,
        },
        score: 0,
        lastEvent: undefined,
    }
}

export function getMasteryStatus(state: LearningState): MasteryStatus {
    const { queue, intervalDays } = state.schedulingState

    if (queue === "new") return "unlearned"
    if (queue === "learn") return "learning"
    if (queue === "relearn") return "relearning"

    // review
    return intervalDays < 21 ? "young" : "matured"
}