import type { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";

export function createCleanupresetReviewEvent(repo: ReviewEventRepository) {
    //const repos = useRepositoryContext()
    //const repo = repos.reviewEvent

    const execute = async () => {
        const lastReset = await repo.findLastReset()
        if (!lastReset) return

        return await repo.deleteBefore(lastReset.at)
    }
    return execute
}