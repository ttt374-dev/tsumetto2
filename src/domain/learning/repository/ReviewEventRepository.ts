import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type { ReviewEvent, ReviewEventLog } from "../../review/ReviewEvent";

export class ReviewEventRepository {
    constructor(
        private readonly store: ReviewEventPersistence
    ) {}
    static create(store: ReviewEventPersistence){
        return new ReviewEventRepository(store)
    }
    async load(){ return this.store.load()}
    async append(event: ReviewEvent) {
        const log = await this.store.load()
        const nextLog = [...log, event]
        await this.store.save(nextLog)
    }
    async replaceAll(events: ReviewEventLog) {
        await this.store.save(events)
    }
}
////////////////////////////////////
const LEARNING_EVENT_LOG_FILE = "learning_event_log.json";

export interface ReviewEventPersistence {
    load(): Promise<ReviewEvent[]>
    save(events: ReviewEvent[]): Promise<void>
}

export class LocalStorageReviewEventPersistence implements ReviewEventPersistence {
    async load(): Promise<ReviewEvent[]> {
        try {
            const result = await Filesystem.readFile({
                path: LEARNING_EVENT_LOG_FILE,
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
            console.error("learning event store load error", e)
            return [];
            //throw e
        }
    }

    async save(events: ReviewEvent[]): Promise<void> {
        try {
            await Filesystem.writeFile({
                path: LEARNING_EVENT_LOG_FILE,
                data: JSON.stringify(events),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
        } catch (e){
            console.error("learning event store write error", e)
            throw e
        }
    }
}
