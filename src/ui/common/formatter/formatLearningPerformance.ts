import type { Learning } from "@/domain/learning/entity/Learning"
import { inDays } from "@/ui/library/components/LibraryListItem"

export function formatLearningPerformance(learning: Learning): string {
    
    const indays = inDays(learning.nextReviewedAt)
    const scoreString = learning.score.toFixed(1)
    return `[${scoreString}](${learning.solvedCount}:${learning.failedCount})`
   
}
