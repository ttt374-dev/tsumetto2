import type { ProblemId } from "@/domain/problem/entity/Problem"

const MAX_INTERVAL_DAYS = 60

export type SolvedOutcome = "solved" | "failed" | "unanswered"
export type SolvedResult = {
  outcome: SolvedOutcome
  mistakes: number
  revealed: boolean
  elapsedSec: number
}
export function createSolvedResult(mistakes: number, revealed: boolean, elapsedSec: number): SolvedResult {
    return {
        outcome: revealed ? "failed" : "solved",
        mistakes, revealed, elapsedSec,
    }
}

export function createDefaultSolvedResult(): SolvedResult{
    return {
        outcome: "unanswered",
        mistakes: 0,
        revealed: false,
        elapsedSec: 10,
    }    
}
export type LearningData = {
    problemId: ProblemId
    solvedCount: number
    failedCount: number

    intervalDays: number        // 次回までの日数
    nextReviewedAt: number        // 次に解くべき時刻（ms）
    easeFactor: number          // 習熟度（Anki系）

    lastAnsweredAt?: number
    lastAnswerResult?: SolvedResult
}

function createDefaultValues(problemId: ProblemId): LearningData {
    return {
        problemId: problemId,
        solvedCount: 0,
        failedCount: 0,
        intervalDays: 0,
        nextReviewedAt: Date.now(),
        easeFactor: 2.5,
    }
}
export type LearningDTO = LearningData 
//////////////////////////////////////////////////////////////////
export class Learning {
    constructor(
        readonly problemId: ProblemId,
        readonly solvedCount: number,
        readonly failedCount: number,

        readonly intervalDays: number,
        readonly nextReviewedAt: number,
        readonly easeFactor: number,

        readonly lastAnsweredAt?: number,
        readonly lastAnswerResult?: SolvedResult,

    ){}
    static create(problemId: ProblemId, init?: Partial<LearningData>): Learning {
        return Learning.fromDTO({...createDefaultValues(problemId),  ...init})
    }
    toDTO(): LearningDTO {
        return {
            problemId: this.problemId,
            solvedCount: this.solvedCount,
            failedCount: this.failedCount,
            intervalDays: this.intervalDays,
            nextReviewedAt: this.nextReviewedAt,
            easeFactor: this.easeFactor,            
            lastAnsweredAt: this.lastAnsweredAt,
            lastAnswerResult: this.lastAnswerResult,
        }
    }
    static fromDTO(dto: LearningDTO): Learning {
        return new Learning(dto.problemId, dto.solvedCount, dto.failedCount,
            dto.intervalDays, dto.nextReviewedAt, dto.easeFactor,
            dto.lastAnsweredAt, dto.lastAnswerResult,
        )
    }
    //////////////////////////////////////
    // query
    get totalCount(): number { 
        return this.solvedCount + this.failedCount
    }
    get accuracy(): number { 
        return this.totalCount === 0 ? 0 : this.solvedCount / this.totalCount
    }

}

export type LearningRecord = Record<ProblemId, Learning>