import { Capacitor } from "@capacitor/core"
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { internalDataStorage } from "@/infrastructure/backup/BackupInternalStorage";

export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
}

export const manualBackupWriter: BackupWriter = {
    write: async (data: string, filename) => {
        const writer = Capacitor.isNativePlatform()
            ? capacitorShareFileWriter
            : webDownloadFileWriter

        await writer.write(data, filename)
    }
}
export const autobackupFileWriter: BackupWriter = internalDataStorage
/////////////
export const capacitorShareFileWriter: BackupWriter = {
    async write(data: string, filename: string) {
        // Android / iOS
        const file = await Filesystem.writeFile({
            path: filename,
            directory: Directory.External,
            data,
            encoding: Encoding.UTF8,
        });
        const fileUri = `file://${file.uri}`;

        await Share.share({
            title: 'バックアップファイル',
            text: 'バックアップデータです',
            //url: `data:application/json;base64,${file.data}`,
            url: fileUri,
            dialogTitle: 'バックアップを保存'
        });
    }
}
export const webDownloadFileWriter: BackupWriter = {
    async write(data: string, filename: string) {
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }
}
//export const isNative = () => 