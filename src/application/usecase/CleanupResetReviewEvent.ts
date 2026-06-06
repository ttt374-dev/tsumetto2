import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";

export function useCleanupresetReviewEvent() {
    const repos = useRepositoryContext()
    const repo = repos.reviewEvent

    const execute = async () => {
        const lastReset = await repo.findLastReset()
        if (!lastReset) return

        return await repo.deleteBefore(lastReset.at)
    }
    return execute
}