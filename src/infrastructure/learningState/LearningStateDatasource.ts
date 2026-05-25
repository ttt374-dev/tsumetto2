import type { LearningState } from "@/domain/learning/entity/LearningState"
import type { ProblemId } from "@/domain/problem/entity/Problem"

export interface LearningStateDatasource {
    findByProblemId(problemId: ProblemId): LearningState | undefined
    save(problemId: ProblemId, state: LearningState, lastEventAt: number): Promise<void>
    clear(): Promise<void>
}
//////////////////////
export class LocalfileLearningStateDatasource implements LearningStateDatasource {
    findByProblemId(problemId: ProblemId): LearningState | undefined {
        return undefined
    }
    async save(problemId: ProblemId, state: LearningState, lastEventAt: number): Promise<void> {
        return
    }
    async clear(): Promise<void> {
        return
    }
}