import type { ProblemId } from "../entity/Problem"
import type { LearningState } from "@/domain/learning/entity/LearningState"

export class ProblemStats {
    constructor(
        readonly problemCount: number,
        readonly solvedCount: number,    
        readonly failedCount: number,        
        readonly easeFactor: number,
        readonly intervalDays: number,
        readonly score: number,
    ){}

    static create(ids: ProblemId[], learningRecords: Record<ProblemId, LearningState>) {
        let solved = 0
        let failed = 0
        let attempted = 0
        let easeFactor = 0
        let intervalDays = 0       
        let score = 0

        for (const id of ids) {
            const learning = learningRecords[id]
            if (!learning) continue

            solved += learning.stats.solvedCount
            failed += learning.stats.failedCount
            attempted += learning.stats.attemptCount
            easeFactor += learning.schedulingState.easeFactor
            intervalDays += learning.schedulingState.intervalDays
            score += learning.score
        }
        easeFactor = (ids.length > 0) ? easeFactor/ids.length : 0
        intervalDays = (ids.length > 0) ? intervalDays/ids.length : 0
        score = (ids.length > 0) ? score/attempted : 0
        return new ProblemStats(
            ids.length,
            solved,
            failed,
            easeFactor,
            intervalDays,
            score,
        )
    }

    get totalCount(): number { return this.solvedCount + this.failedCount}
    //get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}