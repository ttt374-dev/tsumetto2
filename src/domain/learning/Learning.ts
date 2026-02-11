import type { SolvedResult } from "../MissionEvent/MissionSummary";
import type { ProblemId } from "../problem/Problem";

const MAX_INTERVAL_DAYS = 60

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

    ////////////////////////////////// 
    // command
    /*
    answer(result: AnswerResult, seconds: number) {
        const solved = result === "solved" ? 1 : 0
        const failed = result === "failed" ? 1 : 0
        return this.scheduleNext(result, seconds)
        //return Learning.fromDTO({...this.toDTO(), 
        //    solvedCount: this.solvedCount + solved,
        //    failedCount: this.failedCount + failed,
        //})
    }*/
    /*
    // 正解評価
    private judgeAnswerQuality(answer: SolvedResult, sec: number): number {
        if (answer === "failed") return 0
        if (sec < 10) return 5
        return 2
    }

    // --- 新しいインスタンスを返す ---
    answer(answer: SolvedResult, sec: number=20, now: number = Date.now()): Learning {
        const quality = this.judgeAnswerQuality(answer, sec)

        let intervalDays = this.intervalDays
        let easeFactor = this.easeFactor
        let solvedCount = this.solvedCount
        let failedCount = this.failedCount
        
        if (quality < 2) {
            //intervalDays = 1
            intervalDays = Math.max(1, Math.round(intervalDays * 0.3))
            failedCount += 1
        } else {
            solvedCount += 1
            if (intervalDays === 0) intervalDays = 1
            else if (intervalDays === 1) intervalDays = 3
            //else intervalDays = Math.round(intervalDays * easeFactor)
            else intervalDays = Math.min(Math.round(intervalDays * easeFactor), MAX_INTERVAL_DAYS)
        }

        easeFactor = Math.max(
            1.3,
             easeFactor + 0.1 - (3 - quality) * 0.05
            //easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
        )

        const nextReviewedAt = now + intervalDays * 24 * 60 * 60 * 1000

        return new Learning(
            this.problemId,
            solvedCount,
            failedCount,
            intervalDays,
            nextReviewedAt,
            easeFactor,
            now,
            answer)            
    }
            */
}

export type LearningRecord = Record<ProblemId, Learning>