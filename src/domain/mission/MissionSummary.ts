import type { LearningRecord } from "../learning/Learning"
import type { ProblemId } from "../problem/Problem"

export type SolvedResult = "solved" | "failed"

export type MissionResultEntry = {
    problemId: ProblemId,
    solvedResult: SolvedResult,
}

export class MissionSummary {
    constructor(
        readonly problemCount: number,
        readonly solvedCount: number,    
        readonly failedCount: number,        
    ){}
    static create(): MissionSummary { return new MissionSummary(0, 0, 0)}
    static createFromResultList(missionResultList: MissionResultEntry[]): MissionSummary {
        return new MissionSummary(
            1,
            missionResultList.filter(r => r.solvedResult === "solved").length,
            missionResultList.filter(r => r.solvedResult === "failed").length
        )        
    }
    static createFromLearningRecords(learningRecords: LearningRecord): MissionSummary {
        const learningList = Object.values(learningRecords)

        return new MissionSummary(
            learningList.length,
            learningList.reduce((sum, learning) => sum + learning.solvedCount, 0),
            learningList.reduce((sum, learning) => sum + learning.failedCount, 0),
        )
    }
    get totalCount(): number { return this.solvedCount + this.failedCount}
    get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}