import { useToast, type Toast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { autobackupFilename, createBackupRestoreUsecase, type BackupData, type BackupRestoreResult } from "@/application/usecase/BackupRestoreUsecase"
import { useDialogState, type DialogState } from "@/ui/common/hooks/useDialogState"
import { rebuildProjections, reloadAllStores } from "@/ui/App/useBootstrapStores"
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
    const usecase = createBackupRestoreUsecase({
        problem: repos.problem, reviewEvent: repos.reviewEvent, mission: repos.mission})    

    const backup = async () => {
        const result = await usecase.manualBackup()
        toast(createResultToast(result, "backup"))
        return result
    }
    const restore = async (file: File) => {
        const result = await restoreBackupData(() => readParseJsonFile(file))
        toast(createResultToast(result, "restore"))
        return result
    }
    const restoreAutoBackup = async () => {
        const result = await restoreBackupData(async () => {
            const text = await internalDataStorage.read(autobackupFilename)
            return parseBackupData(text)
        })
        toast(createResultToast(result, "restore"))
        return result
    }
    
    const restoreBackupData = async (
        loadBackupData: () => Promise<BackupData>
    ): Promise<BackupRestoreResult> => {
        try {
            const backupData = await loadBackupData()
            const result = await usecase.restore(backupData)

            if (result.ok) reloadAllStores()                
            //reloadStores() 
            //else console.error(result.error)
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
//////////////////////////////////////////
const ACTION_LABELS = {
    backup: "バックアップ",
    restore: "レストア",
} as const
type Action = keyof typeof ACTION_LABELS
function createResultToast(result: BackupRestoreResult, action: Action): Toast {
    const label = ACTION_LABELS[action]
    if (result.ok)
        return { message: `${result.value.count.problem}件${label}しました` }
    else
        return ({ message: `${label}失敗しました: ${result.error.code}`, severity: "error" })
}
async function readParseJsonFile(
    file: File
): Promise<BackupData> {
    const text = await file.text()
    //return JSON.parse(text)
    return parseBackupData(text)
}
function parseBackupData(text: string): BackupData {
    return JSON.parse(text)
}