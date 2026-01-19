import type { SolvedResult } from "@/application/missionFsm/MissionFsm"
import type { ProblemId } from "../problem/Problem"

export type MissionResultEntry = {
    problemId: ProblemId,
    solvedResult: SolvedResult,
}

export class MissionSummary {
    constructor(
        readonly solvedCount: number,    
        readonly failedCount: number,        
    ){}
    static create(missionResultList: MissionResultEntry[]) {
        return new MissionSummary(
            missionResultList.filter(r => r.solvedResult === "solved").length,
            missionResultList.filter(r => r.solvedResult === "failed").length
        )        
    }
    get totalCount(): number { return this.solvedCount + this.failedCount}
    get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}