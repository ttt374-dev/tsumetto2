import { Capacitor } from "@capacitor/core"
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import type { BackupWriter } from "@/application/usecase/backup/BackupRestoreUsecase";

export const fileBackupWriter: BackupWriter = {
    write: async (data: string, filename: string) => {
        if (Capacitor.isNativePlatform()) {
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
        } else {
            // Web
            const blob = new Blob([data], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            a.click()
            URL.revokeObjectURL(url)
        }

    }
}