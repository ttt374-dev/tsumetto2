import type { ReviewEvent, ReviewEventLog } from "../ReviewEvent";
import type { ReviewEventDatasource } from "@/infrastructure/review/ReviewEventDatasource";

export class ReviewEventRepository {
    constructor(
        private readonly dataSource: ReviewEventDatasource
    ) {}

    static create(dataSource: ReviewEventDatasource) {
        return new ReviewEventRepository(dataSource)
    }

    async load() {
        return this.dataSource.list()
    }

    async append(event: ReviewEvent) {
        await this.dataSource.append(event)
    }

    async replaceAll(events: ReviewEventLog) {
        await this.dataSource.replaceAll(events)
    }   
    
}
////////////////////////////////////
/*
const REVIEW_EVENT_LOG_FILE = "learning_event_log.json";

export interface ReviewEventPersistence {
    load(): Promise<ReviewEvent[]>
    save(events: ReviewEvent[]): Promise<void>
}

export class LocalStorageReviewEventPersistence implements ReviewEventPersistence {
    async load(): Promise<ReviewEvent[]> {
        try {
            const result = await Filesystem.readFile({
                path: REVIEW_EVENT_LOG_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
            const dataStr =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text()
            const data: ReviewEvent[] = JSON.parse(dataStr)
            
            return data

        } catch (e) {
            console.error("review event store load error", e)
            return [];
            //throw e
        }
    }

    async save(events: ReviewEvent[]): Promise<void> {
        try {
            await Filesystem.writeFile({
                path: REVIEW_EVENT_LOG_FILE,
                data: JSON.stringify(events),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
        } catch (e){
            console.error("review event store write error", e)
            throw e
        }
    }
}
*/