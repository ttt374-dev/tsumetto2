class ReviewSyncService {
    private running = false

    start() {
        if (this.running) return
        this.running = true
        this.loop()
    }

    async loop() {
        while (this.running) {
            await this.process()
            await sleep(2000)
        }
    }

    async process() {
        const unsynced = getReviewStore().getUnsynced()

        for (const r of unsynced) {
            try {
                await repo.save(r)
                markSynced(r.id)
            } catch {
                markFailed(r.id)
            }
        }
    }
}