import type { LearningRecord } from "@/domain/learning/entity/Learning"
import type { Problem, ProblemId } from "../entity/Problem"
import type { FilterState } from "../service/query/filter"
import { applyFilter } from "../service/query/applyFilter"
import type { MissionResultEntry } from "@/domain/mission/entity/Mission"

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

        console.log("create stat", ids.length)

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
    static createWithFilter(problems: Problem[], learningRecords: LearningRecord, filterState: FilterState){
        const filtered = applyFilter(problems, learningRecords, filterState)
        return this.create(filtered.map(p=>p.id), learningRecords)
    }
    static createFromMissionResultList(missionResultList: MissionResultEntry[]): ProblemStats {

        return new ProblemStats(
            missionResultList.length,
            missionResultList.filter(r => r.solvedResult === "solved").length,
            missionResultList.filter(r => r.solvedResult === "failed").length,
            0,
            0,
        )
    }

    get totalCount(): number { return this.solvedCount + this.failedCount}
    get accuracy(): number { return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount }
}