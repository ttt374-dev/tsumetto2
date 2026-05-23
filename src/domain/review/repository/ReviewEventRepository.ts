import type { ReviewEvent, ReviewEventLog } from "../ReviewEvent";
import type { ReviewEventDatasource } from "@/infrastructure/review/ReviewEventDatasource";

export class ReviewEventRepository {
    constructor(
        private readonly dataSource: ReviewEventDatasource
    ) {}

    static create(dataSource: ReviewEventDatasource) {
        return new ReviewEventRepository(dataSource)
    }

    async list() {
        return this.dataSource.list()
    }

    async append(event: ReviewEvent) {
        await this.dataSource.append(event)
    }

    async replaceAll(events: ReviewEventLog) {
        await this.dataSource.replaceAll(events)
    }
}
