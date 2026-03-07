import type { LearningRecord } from "@/domain/learning/entity/Learning"
import type { Problem, ProblemId } from "../entity/Problem"

export class ProblemStats {
    constructor(
        readonly problemCount: number,
        readonly solvedCount: number,    
        readonly failedCount: number,        
        readonly easeFactor: number,
        readonly intervalDays: number,
    ){}

    static create(ids: ProblemId[], learningRecords: LearningRecord) {
        let solved = 0
        let failed = 0
        let easeFactor = 0
        let intervalDays = 0       

        for (const id of ids) {
            const learning = learningRecords[id]
            if (!learning) continue

            solved += learning.solvedCount
            failed += learning.failedCount
            easeFactor += learning.easeFactor
            intervalDays += learning.intervalDays
        }
        easeFactor = (ids.length > 0) ? easeFactor/ids.length : 0
        intervalDays = (ids.length > 0) ? intervalDays/ids.length : 0
        return new ProblemStats(
            ids.length,
            solved,
            failed,
            easeFactor,
            intervalDays,
        )
    }

    get totalCount(): number { return this.solvedCount + this.failedCount}
    get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}