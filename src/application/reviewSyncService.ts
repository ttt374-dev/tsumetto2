/*
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"


export class ReviewSyncService {
    private running = false

    start() {
        if (this.running) return
        this.running = true
        this.loop()
    }

    async loop() {
        while (this.running) {
            await this.flushIfDirty()
            await sleep(2000)
        }
    }

    async flushIfDirty() {
        const store = useReviewEventStore.getState()

        if (!store.isDirty) return

        try {
            await store.repo?.replaceAll(store.eventLog)
            console.log("SYNC REPLACEALL")
            useReviewEventStore.setState({ isDirty: false })
        } catch (e) {
            console.error("sync failed", e)
        }
    }
    async flushNow() {
        const store = useReviewEventStore.getState()

        if (!store.isDirty) return

        await store.repo?.replaceAll(store.eventLog)
        useReviewEventStore.setState({ isDirty: false })
    }
}

const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

*/