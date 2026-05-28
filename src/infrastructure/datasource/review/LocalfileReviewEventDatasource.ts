import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import type { ReviewEvent, ReviewEventLog } from "@/domain/review/types/ReviewEvent"
import type { ReviewEventDatasource } from "@/domain/review/datasource/ReviewEventDatasource";

const REVIEW_EVENT_LOG_FILE = "learning_event_log.json";

export class LocalfileReviewEventDataSource implements ReviewEventDatasource {
    async findAll(): Promise<ReviewEventLog> {
        return this.read()
    }
    async append(event: ReviewEvent): Promise<void> {
        const current = await this.findAll();
        await this.write([...current, event]);
    }
    async appendMany(events: ReviewEvent[]): Promise<void> {
        const current = await this.findAll()
        await this.write([...current, ...events,])
    }

    async replaceAll(events: ReviewEventLog): Promise<void> {
        await this.write(events);
    }
    ///////////////
    // private
    private async read() {
        try {
            const result = await Filesystem.readFile({
                path: REVIEW_EVENT_LOG_FILE,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

            const text =
                typeof result.data === "string"
                    ? result.data
                    : await result.data.text();

            return JSON.parse(text);
        } catch (e) {
            console.error("review event load error", e);
            return [];
        }
    }
    private async write(events: ReviewEventLog) {
        try {
            await Filesystem.writeFile({
                path: REVIEW_EVENT_LOG_FILE,
                data: JSON.stringify(events),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });
        } catch (e) {
            console.error("review event write error", e);

        }
    }
}