import type { LearningStateSnapshotRepository } from "@/domain/learning/repository/LearningStateSnapshotRepository"
import { reduceLearningState } from "@/domain/learning/service/projectLearningState"
import type { ReviewEvent } from "@/domain/review/types/ReviewEvent"

export class LearningStateProjector {
    constructor(
        private readonly snapshots:
            LearningStateSnapshotRepository,
    ) {}

    async apply(event: ReviewEvent) {

        const prev =
            await this.snapshots.findByProblemId(
                event.problemId
            )

        const next = reduceLearningState(prev, event)

        await this.snapshots.save(
            event.problemId,
            next,
            event.at,
        )
    }

    async rebuild(events: ReviewEvent[]) {
        await this.snapshots.clear()

        const sorted =
            [...events].sort((a, b) => a.at - b.at)

        for (const event of sorted) {
            await this.apply(event)
        }
    }
}