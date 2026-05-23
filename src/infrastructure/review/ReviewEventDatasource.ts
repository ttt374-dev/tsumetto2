import type { ReviewEvent, ReviewEventLog } from "@/domain/review/ReviewEvent"

export interface ReviewEventDatasource {
    list(): Promise<ReviewEventLog>
    append(event: ReviewEvent): Promise<void>
    appendMany(events: ReviewEventLog): Promise<void>
    replaceAll(events: ReviewEventLog): Promise<void>
}
