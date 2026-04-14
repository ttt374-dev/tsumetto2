import { MasteryLevelTextMapping, type LearningState } from "@/domain/learning/entity/LearningState";
import { formatDuration } from "@/ui/common/formatter";


export function toLearningStateViewData(state: LearningState) {
    return {
        scoreText: state.score.toFixed(1),
        nextReviewedAtText: new Date(state.nextReviewedAt).toLocaleString(),
        lastAnsweredAtText: state.lastEvent ? new Date(state.lastEvent.at).toLocaleString() : "",
        easeFactorText: state.easeFactor.toFixed(2),

        nextReviewedInText: formatDuration(state.nextReviewedAt - Date.now()),
        performaceText: `[${state.score.toFixed(1)}](${state.stats.solvedCount}:${state.stats.failedCount})`,
        masteryLevelText: MasteryLevelTextMapping[state.masteryLevel],
    }

}