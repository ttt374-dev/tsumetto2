import type { BackupData } from "@/application/usecase/BackupRestoreUsecase";


export interface BackupReader {
    read(file: File): Promise<BackupData>
}

export const jsonBackupReader: BackupReader = {
    async read(file) {
        const text = await file.text()
        return JSON.parse(text)
    }
}