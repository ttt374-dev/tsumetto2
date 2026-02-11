import type { LearningRecord } from "../learning/Learning"
import type { MissionResultEntry } from "../MissionEvent/MissionEvent"
import type { Problem } from "./Problem"


export class ProblemStats {
    constructor(
        readonly problemCount: number,
        readonly solvedCount: number,    
        readonly failedCount: number,        
    ){}

    static create(problems: Problem[], learningRecords: LearningRecord) {
        let solved = 0
        let failed = 0

        for (const p of problems) {
            const learning = learningRecords[p.id]
            if (!learning) continue

            solved += learning.solvedCount
            failed += learning.failedCount
        }

        return new ProblemStats(
            problems.length,
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