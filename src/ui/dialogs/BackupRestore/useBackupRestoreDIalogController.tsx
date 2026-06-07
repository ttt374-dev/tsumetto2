import { useToast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { manualBackupWriter } from "@/infrastructure/backup/BackupWriter"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useBackupRestoreUsecase, type BackupResult, type RestoreResult } from "@/application/usecase/BackupRestoreUsecase"
import { useDialogState, type DialogState } from "@/ui/common/hooks/useDialogState"
import { rebuildProjections } from "@/ui/App/useBootstrapStores"
import { jsonBackupReader } from "@/infrastructure/backup/BackupReader"

export type BackupRestoreController = DialogState & {
    backup: () => Promise<BackupResult>
    restore: (file: File) => Promise<RestoreResult>
}

export function useBackupRestoreDialogController(): BackupRestoreController {
    const dialog = useDialogState()  
    const toast = useToast()
    const repos = useRepositoryContext()
    const usecase = useBackupRestoreUsecase(repos.problem, repos.reviewEvent, repos.mission)
    const reloadStores = useStoresReloader()

    const backup = async () => {
        const result = await usecase.manualBackup()
        if (result.ok)            
            toast({ message: `${result.value.problemCount}件バックアップしました` })
        else
            toast({ message: "バックアップ失敗", severity: "error" })  

        return result

    }
    const restore = async (file: File) => {
        try {
            const backupData = await jsonBackupReader.read(file)
            const result = await usecase.restore(backupData)

            if (result.ok) {
                reloadStores()
            }

            return result
        } catch {
            return {
                ok: false,
                error: { code: "invalid-format" }
            } as RestoreResult
        }

        /*
        const result = await restoreFromFile(file)
        if (result.ok) {
            toast({ message: `${result.value.problemCount}件リストアしました` })
            //reloadRelevantStores()
            reloadStores()
            
        } else {
            toast({ message: "リストア失敗", severity: "error" })
        }
        return result
        */
    }

    const restoreFromFile = async (file: File): Promise<RestoreResult> => {
        try {
            const json = await parseBackupFile(file)
            return await usecase.restore(json)
        } catch {
            return { ok: false, error: { code: "invalid-format" } } satisfies RestoreResult
        }
    }

    return {
        ...dialog,
        backup, restore,
    }
}
// infra
async function parseBackupFile(file: File){
    const text = await file.text()
    const json = JSON.parse(text)
    return json
}
function useStoresReloader() {
    const reloadProblems = useProblemStore(s => s.reload)
    const reloadReviewEvents = useReviewEventStore(s => s.reload)
    const reloadMissions = useMissionStore(s => s.reload)

    const reloadStores = () => {
        reloadProblems()
        reloadReviewEvents()
        reloadMissions()
        rebuildProjections()
    }

    return reloadStores
}