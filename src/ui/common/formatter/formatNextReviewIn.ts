import { formatDuration } from "@/ui/common/formatter/formatDuration";

export function formatNextReviewIn(date: number): string {
    return formatDuration(date-Date.now())
}