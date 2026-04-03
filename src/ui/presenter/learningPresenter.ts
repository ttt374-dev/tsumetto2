import type { Learning } from "@/domain/learning/entity/Learning";
import { formatDuration } from "@/ui/common/formatter";

export function toLearningViewData(l: Learning){
    return {
        scoreText: l.score.toFixed(1),
        nextReviewedAtText: new Date(l.nextReviewedAt).toLocaleString(),     
        lastAnsweredAtText: l.lastAnsweredAt ? new Date(l.lastAnsweredAt).toLocaleString() : "",
        easeFactorText: l.easeFactor.toFixed(2),

        nextReviewedInText: formatDuration(l.nextReviewedAt-Date.now()),
        performaceText: `[${l.score.toFixed(1)}](${l.solvedCount}:${l.failedCount})`
    }
}
