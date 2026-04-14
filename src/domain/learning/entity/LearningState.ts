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
    attemptCount: number,
    solvedCount: number,
    failedCount: number,

    intervalDays: number,
    nextReviewedAt: number,
    easeFactor: number,
    
    queue: LearningQueue,
    stepIndex: number,
    masteryLevel: MasteryLevel,
    score: number,

    //lastAnsweredAt?: number,
    //lastSolvedResult?: SolvedResult

    lastEvent?: ReviewReviewedEvent 
}

export const DefaultLearningState: LearningState = {
    attemptCount: 0,
    solvedCount: 0,
    failedCount: 0,
    score: 0,
    intervalDays: 0,
    nextReviewedAt: Date.now(),    
    easeFactor: 2.5,

    queue: "new",
    stepIndex: 0,
    masteryLevel: "unlearned",

    

    //lastAnsweredAt: undefined,
    //lastSolvedResult: undefined,
}

