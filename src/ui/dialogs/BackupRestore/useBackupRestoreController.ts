import { useBackupRestoreUsecase } from "@/application/usecase/problem/backup/BackupRestoreUsecase"
import { fileBackupWriter } from "@/infrastructure/fileBackupWriter"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"

export function useBackupRestoreController() {
    const repos = useRepositoryContext()
    const usecase = useBackupRestoreUsecase(
        repos.problem,
        repos.reviewEvent,
        repos.mission,
        fileBackupWriter
    )

    const clearAllEvents = useReviewEventStore(s => s.clearAll)

    const backup = async () => {
        return await usecase.backup()
    }

    const restoreFromFile = async (file: File) => {
        try {
            const text = await file.text()
            const json = JSON.parse(text)
            return await usecase.restore(json)
        } catch {
            return { ok: false, error: { code: "invalid-format" } } as const
        }
    }

    const clearAll = () => {
        clearAllEvents()
    }

    return {
        backup,
        restoreFromFile,
        clearAll,
    }
}