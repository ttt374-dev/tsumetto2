import { MasteryLevelTextMapping, type LearningState } from "@/domain/learning/entity/LearningState";
import { formatDuration } from "@/ui/common/formatter";


export function toLearningStateViewData(state: LearningState) {
    return {
        scoreText: state.score.toFixed(1),
        nextReviewedAtText: new Date(state.nextReviewedAt).toLocaleString(),
        lastAnsweredAtText: state.lastAnsweredAt ? new Date(state.lastAnsweredAt).toLocaleString() : "",
        easeFactorText: state.easeFactor.toFixed(2),

        nextReviewedInText: formatDuration(state.nextReviewedAt - Date.now()),
        performaceText: `[${state.score.toFixed(1)}](${state.solvedCount}:${state.failedCount})`,
        masteryLevelText: MasteryLevelTextMapping[state.masteryLevel],
    }

}