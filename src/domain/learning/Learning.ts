import type { ProblemId } from "../problem/Problem";

export type LearningData = {
    problemId: ProblemId,
    solvedCount: number,
    failedCount: number,
}

function createDefaultValues(problemId: ProblemId): LearningData {
    return {
        problemId: problemId,
        solvedCount: 0,
        failedCount: 0,
    }
}
export type LearningDTO = LearningData 

export class Learning {
    constructor(
        readonly problemId: ProblemId,
        readonly solvedCount: number,
        readonly failedCount: number,
    ){}
    static create(problemId: ProblemId, init?: Partial<LearningData>): Learning {
        return Learning.fromDTO({...createDefaultValues(problemId),  ...init})
    }
    toDTO(): LearningDTO {
        return {
            problemId: this.problemId,
            solvedCount: this.solvedCount,
            failedCount: this.failedCount
        }
    }
    static fromDTO(dto: LearningDTO): Learning {
        return new Learning(dto.problemId, dto.solvedCount, dto.failedCount)
    }
    //////////////////////////////////////
    answer() {
        return Learning.fromDTO({...this.toDTO(), solvedCount: this.solvedCount+1})
    }

}

export type LearningRecord = Record<string, Learning>