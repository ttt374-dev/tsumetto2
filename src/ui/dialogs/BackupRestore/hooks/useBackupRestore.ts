import { useBackupRestoreUsecase, type BackupRestoreError, type BackupResultOk, type RestoreResult, type RestoreResultOk } from "@/application/usecase/problem/backup/BackupRestoreUsecase";
import { fileBackupWriter } from "@/infrastructure/fileBackupWriter";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useActionState, useState } from "react";

export type BackupStatus = 
    | { type: "ok",  value: BackupResultOk}
    | { type: "error", error: BackupRestoreError}

export type RestoreStatus= 
    | { type: "ok",  value: RestoreResultOk}
    | { type: "error", error: BackupRestoreError}

export function useBackupRestore(){
    const repos = useRepositoryContext()

    const [isOpen, setIsOpen] = useState(false)
    const usecase = useBackupRestoreUsecase(repos.problem, repos.reviewEvent, repos.mission, fileBackupWriter)

    const executeBackup = async (): Promise<BackupStatus> => {        
        const result = await usecase.backup()
        if (!result.ok)
            return { type: "error", error: result.error}

        return {type: "ok", value: result.value}
        
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

}

