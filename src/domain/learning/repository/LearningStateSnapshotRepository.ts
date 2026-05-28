import type { LearningState } from "@/domain/learning/entity/LearningState"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { LearningStateDatasource } from "@/infrastructure/datasource/learningState/LearningStateDatasource"

export class LearningStateSnapshotRepository {
    constructor(
            private readonly dataSource: LearningStateDatasource
        ) {}

    findByProblemId(problemId: ProblemId): LearningState | undefined{
        return this.dataSource.findByProblemId(problemId)
    }

    async save(problemId: ProblemId, state: LearningState, lastEventAt: number){
        this.dataSource.save(problemId, state, lastEventAt)
    }

    async clear(): Promise<void>{
        this.dataSource.clear()
    }
}

