import { useToast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { autobackupFilename, useBackupRestoreUsecase, type BackupData, type BackupRestoreResult } from "@/application/usecase/BackupRestoreUsecase"
import { useDialogState, type DialogState } from "@/ui/common/hooks/useDialogState"
import { rebuildProjections } from "@/ui/App/useBootstrapStores"
import { internalDataStorage } from "@/infrastructure/backup/BackupInternalStorage"

export type BackupRestoreController = DialogState & {
    backup: () => Promise<BackupRestoreResult>
    restore: (file: File) => Promise<BackupRestoreResult>
    restoreAutoBackup: () => Promise<BackupRestoreResult>
}

export function useBackupRestoreController(): BackupRestoreController {
    const dialog = useDialogState()  
    const toast = useToast()
    const repos = useRepositoryContext()
    const usecase = useBackupRestoreUsecase({
        problem: repos.problem, reviewEvent: repos.reviewEvent, mission: repos.mission})
    const reloadStores = useStoresReloader()

    const backup = async () => {
        const result = await usecase.manualBackup()
        if (result.ok)            
            toast({ message: `${result.value.problem}件バックアップしました` })
        else
            toast({ message: "バックアップ失敗", severity: "error" })
        return result

    }
    const restore = async (file: File) => {
        const result = await restoreData(() => readParseJsonFile(file))
        toastRestoreResult(result)
        return result
    }
    const restoreAutoBackup = async () => {
        const result = await restoreData(async () => {
            const text = await internalDataStorage.read(autobackupFilename)
            //console.log("stroge read text", text)
            return JSON.parse(text)
        })
        toastRestoreResult(result)
        return result
    }
    const toastRestoreResult = (result: BackupRestoreResult) => {        
        if (result.ok) {
            toast({ message: `${result.value.problem}件レストアしました` })
        } else {
            toast({ message: `レストアに失敗しました: ${result.error.code}`, severity: "error" })
        }
    }
    const restoreData = async (
        loadBackupData: () => Promise<BackupData>
    ): Promise<BackupRestoreResult> => {
        try {
            const backupData = await loadBackupData()
            const result = await usecase.restore(backupData)

            if (result.ok) reloadStores()
            return result
        } catch (e){
            console.error(e)
            return {
                ok: false,
                error: { code: "invalid-format" }
            }
        }
    }
    return {
        ...dialog,
        backup, restore, restoreAutoBackup
    }
}
function createToastResultMessage(status: boolean, okMessage: string, errorMessage: string){
    if (status){
        return { message: okMessage, severity: "success"}
    } else {
        return { message: errorMessage, severity: "error"}
    }
}
async function readParseJsonFile(file: File){
    const text = await file.text()
    return JSON.parse(text)
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