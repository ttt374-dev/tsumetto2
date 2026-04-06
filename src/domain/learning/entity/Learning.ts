/*
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"

//const MAX_INTERVAL_DAYS = 60

export type LearningData = {
    //problemId: ProblemId
    solvedCount: number
    failedCount: number
    score: number

    intervalDays: number        // 次回までの日数
    nextReviewedAt: number        // 次に解くべき時刻（ms）
    easeFactor: number          // 習熟度（Anki系）

    lastAnsweredAt?: number
    lastAnswerResult?: SolvedResult
}

function createDefaultValues(): LearningData {
    return {
        //problemId: problemId,
        solvedCount: 0,
        failedCount: 0,
        score: 0,
        intervalDays: 0,
        nextReviewedAt: Date.now(),
        easeFactor: 2.5,
    }
}
export type LearningDTO = LearningData 
//////////////////////////////////////////////////////////////////
export class Learning {
    constructor(
        //readonly problemId: ProblemId,
        readonly solvedCount: number,
        readonly failedCount: number,
        readonly score: number,

        readonly intervalDays: number,
        readonly nextReviewedAt: number,
        readonly easeFactor: number,

        readonly lastAnsweredAt?: number,
        readonly lastAnswerResult?: SolvedResult,

    ){}
    static create(init?: Partial<LearningData>): Learning {
        return Learning.fromDTO({...createDefaultValues(),  ...init})
    }
    toDTO(): LearningDTO {
        return {
            //problemId: this.problemId,
            solvedCount: this.solvedCount,
            failedCount: this.failedCount,
            score: this.score,
            intervalDays: this.intervalDays,
            nextReviewedAt: this.nextReviewedAt,
            easeFactor: this.easeFactor,            
            lastAnsweredAt: this.lastAnsweredAt,
            lastAnswerResult: this.lastAnswerResult,
        }
    }
    static fromDTO(dto: LearningDTO): Learning {
        return new Learning(dto.solvedCount, dto.failedCount,
            dto.score,
            dto.intervalDays, dto.nextReviewedAt, dto.easeFactor,
            dto.lastAnsweredAt, dto.lastAnswerResult,
        )
    }
    //////////////////////////////////////
    // query
    get totalCount(): number { 
        return this.solvedCount + this.failedCount
    }
    //get accuracy(): number { 
    //    return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount
    //}

}

export type LearningRecord = Record<ProblemId, Learning>*/