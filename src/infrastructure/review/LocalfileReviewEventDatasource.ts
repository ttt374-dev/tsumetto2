import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import type { ReviewEvent, ReviewEventLog } from "../../domain/review/ReviewEvent"
import type { ReviewEventDatasource } from "./ReviewEventDatasource";

const REVIEW_EVENT_LOG_FILE = "learning_event_log.json";

export class LocalfileReviewEventDataSource implements ReviewEventDatasource {
    async list(): Promise<ReviewEventLog> {
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

    async append(event: ReviewEvent): Promise<void> {
        const current = await this.list();
        await this.write([...current, event]);
    }
    async appendMany(events: ReviewEvent[]): Promise<void> {
        const current = await this.list()
        await this.write([...current, ...events,])
    }

    async replaceAll(events: ReviewEventLog): Promise<void> {
        await this.write(events);
    }
    ///////////////
    // private
    private async write(events: ReviewEventLog) {
        await Filesystem.writeFile({
            path: REVIEW_EVENT_LOG_FILE,
            data: JSON.stringify(events),
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });
    }
}