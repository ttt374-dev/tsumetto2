import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { StatsSummary } from "@/domain/learning/entity/StatsSummary";
import type { ProblemId } from "@/domain/problem/entity/Problem";


export function computeStatsSummary(ids: ProblemId[], learningRecords: Record<ProblemId, LearningState>): StatsSummary {
    let attemptCount = 0
    let solvedCount = 0
    let failedCount = 0
    let overdueCount = 0
    let sumIntervalDays = 0
    let sumEaseFactor = 0
    let sumScore = 0    
    const now = Date.now()

    for (const id of ids){
        const s = learningRecords[id]
        if (!s) { overdueCount++; continue }

        attemptCount += s.stats.attemptCount
        solvedCount += s.stats.solvedCount
        failedCount += s.stats.failedCount
        sumEaseFactor += s.schedulingState.easeFactor
        sumIntervalDays += s.schedulingState.intervalDays
        sumScore += s.score
        if (s.schedulingState.nextReviewedAt < now) overdueCount++
    }

    const problemCount = ids.length
    const avgIntervalDays = problemCount > 0 ? sumEaseFactor / problemCount : 0
    const avgEaseFactor = problemCount > 0 ? sumEaseFactor / problemCount : 0
    const avgScore = problemCount > 0 ? sumScore / problemCount : 0

    return {
        problemCount: ids.length, attemptCount, solvedCount, failedCount, overdueCount,
        avgIntervalDays, avgEaseFactor, avgScore,
    }
    
}