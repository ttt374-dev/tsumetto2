import type { ReviewEvent, ReviewEventLog } from "@/domain/review/types/ReviewEvent"

export interface ReviewEventDatasource {
    findAll(): Promise<ReviewEventLog>
    append(event: ReviewEvent): Promise<void>
    appendMany(events: ReviewEventLog): Promise<void>
    replaceAll(events: ReviewEventLog): Promise<void>
}
