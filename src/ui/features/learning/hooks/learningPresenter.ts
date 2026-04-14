import { getMasteryStatus, type LearningState, type MasteryStatus } from "@/domain/learning/entity/LearningState";
import { formatDuration } from "@/ui/common/formatter";

export const MasteryLevelTextMapping: Record<MasteryStatus, string> = {
    "unlearned": "未習熟",
    "learning": "習熟中",
    "matured": "復習（習熟期）",
    "young": "復習（未習熟期）",
    "relearning": "再習得中"
}

export function toLearningStateViewData(state: LearningState) {
    return {
        scoreText: state.score.toFixed(1),
        nextReviewedAtText: new Date(state.schedulingState.nextReviewedAt).toLocaleString(),
        lastAnsweredAtText: state.lastEvent ? new Date(state.lastEvent.at).toLocaleString() : "",
        easeFactorText: state.schedulingState.easeFactor.toFixed(2),

        nextReviewedInText: formatDuration(state.schedulingState.nextReviewedAt - Date.now()),
        performaceText: `[${state.score.toFixed(1)}](${state.stats.solvedCount}:${state.stats.failedCount})`,
        masteryStatusText: getMasteryStatus(state),
    }
}
