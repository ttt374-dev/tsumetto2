import { getMasteryStatus, type LearningState, type MasteryStatus } from "@/domain/learning/entity/LearningState";
import { formatDuration } from "@/ui/common/formatter";

export const MasteryLevelTextMapping: Record<MasteryStatus, string> = {
    unlearned: "未習熟",
    learning: "習熟中",
    matured: "復習（習熟期）",
    young: "復習（未習熟期）",
    relearning: "再習得中"
}

export const learningStateLabels = {
    score: "スコア",
    nextReviewedAt: "次回レビュー日",
    lastAnsweredAt: "前回解答日",
    easeFactor: "習熟度",
    intervalDays: "インターバル",
    masteryStatus: "習熟度合い",    
}
export function toLearningStateViewData(state: LearningState) {
    const masteryStatus = getMasteryStatus(state)
    let masteryStatusLabel = MasteryLevelTextMapping[masteryStatus]
    if (masteryStatus === "learning") masteryStatusLabel += `[${state.schedulingState.stepIndex}]`

    return {
        score: state.score.toFixed(1),
        nextReviewedAt: new Date(state.schedulingState.nextReviewedAt).toLocaleString(),
        lastAnsweredAt: state.lastEvent ? new Date(state.lastEvent.at).toLocaleString() : "",
        easeFactor: state.schedulingState.easeFactor.toFixed(2),
        intervalDays: `${state.schedulingState.intervalDays}d`,

        nextReviewedIn: formatDuration(state.schedulingState.nextReviewedAt - Date.now()),
        performace: `[${state.score.toFixed(1)}](${state.stats.solvedCount}:${state.stats.failedCount})`,
        masteryStatus: masteryStatusLabel,
    }
}
