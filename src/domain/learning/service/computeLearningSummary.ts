import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { LearningSummary } from "@/domain/learning/entity/LearningSummary";
import type { ProblemId } from "@/domain/problem/entity/Problem";


export function computeLearningSummary(ids: ProblemId[], learningRecords: Record<ProblemId, LearningState>): LearningSummary {
    let attemptCount = 0
    let solvedCount = 0
    let failedCount = 0
    let sumIntervalDays = 0
    let sumEaseFactor = 0
    let sumScore = 0

    for (const id of ids){
        const s = learningRecords[id]
        if (!s) continue

        attemptCount += s.stats.attemptCount
        solvedCount += s.stats.solvedCount
        failedCount += s.stats.failedCount
        sumEaseFactor += s.schedulingState.easeFactor
        sumIntervalDays += s.schedulingState.intervalDays
        sumScore += s.score
    }

    const problemCount = ids.length
    const avgIntervalDays = problemCount > 0 ? sumEaseFactor / problemCount : 0
    const avgEaseFactor = problemCount > 0 ? sumEaseFactor / problemCount : 0
    const avgScore = problemCount > 0 ? sumScore / problemCount : 0

    return {
        problemCount: ids.length, attemptCount, solvedCount, failedCount,
        avgIntervalDays, avgEaseFactor, avgScore,
    }
    
}