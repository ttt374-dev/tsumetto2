import type { SolvedResult } from "@/domain/review/solvedResult"

export type MasteryLevel = | "unlearned" | "learning" | "mastered"
export const MasteryLevelTextMapping: Record<MasteryLevel, string> = {
    "unlearned": "未習熟",
    "learning": "習熟中",
    "mastered": "習熟済"

}

export type LearningState = {
    attemptCount: number,
    solvedCount: number,
    failedCount: number,
    score: number,
    intervalDays: number,
    nextReviewedAt: number,
    easeFactor: number,
    
    masteryLevel: MasteryLevel,

    lastAnsweredAt?: number,
    lastSolvedResult?: SolvedResult
}

export const DefaultLearningState: LearningState = {
    attemptCount: 0,
    solvedCount: 0,
    failedCount: 0,
    score: 0,
    intervalDays: 0,
    nextReviewedAt: Date.now(),    
    easeFactor: 2.5,
    masteryLevel: "unlearned",

    //lastAnsweredAt: undefined,
    //lastSolvedResult: undefined,
}

