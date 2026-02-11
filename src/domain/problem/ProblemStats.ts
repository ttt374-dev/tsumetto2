import type { LearningRecord } from "../learning/Learning"
import type { MissionResultEntry } from "../MissionEvent/MissionEvent"
import type { Problem, ProblemId } from "./Problem"


export class ProblemStats {
    constructor(
        readonly problemCount: number,
        readonly solvedCount: number,    
        readonly failedCount: number,        
    ){}

    static create(ids: ProblemId[], learningRecords: LearningRecord) {
        let solved = 0
        let failed = 0

        for (const id of ids) {
            const learning = learningRecords[id]
            if (!learning) continue

            solved += learning.solvedCount
            failed += learning.failedCount
        }

        return new ProblemStats(
            ids.length,
            solved,
            failed,
        )
    }
    static createFromMissionResultList(missionResultList: MissionResultEntry[]): ProblemStats {
        return new ProblemStats(
            missionResultList.length,
            missionResultList.filter(r => r.solvedResult === "solved").length,
            missionResultList.filter(r => r.solvedResult === "failed").length
        )
    }

    get totalCount(): number { return this.solvedCount + this.failedCount}
    get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}