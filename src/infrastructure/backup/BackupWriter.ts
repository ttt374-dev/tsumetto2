import { Capacitor } from "@capacitor/core"
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'


export interface BackupWriter {
    write(data: string, fileName: string): Promise<void>
}

export const manualBackupWriter: BackupWriter = {
    write: async (data: string, filename) => {
        const writer = isNative()
            ? capacitorShareFileWriter
            : webDownloadFileWriter

        await writer.write(data, filename)
    }
}
//const backupFilename = "tsumetto2-autobackup.json"
export const autobackupFileWriter: BackupWriter = {    
    async write(data: string, filename: string){
        const writer = isNative() 
            ? capacitorInternalDataFileWriter
            : webInternalDataFileWriter
        await writer.write(data, filename)
    }
    
}
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
export const capacitorInternalDataFileWriter: BackupWriter = {
    async write(data: string, filename: string) {
        await Filesystem.writeFile({
            path: filename,
            directory: Directory.Data,
            data,
            encoding: Encoding.UTF8,
            recursive: true,
        })
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
export const webInternalDataFileWriter: BackupWriter = {
    async write(data: string, filename: string) {
        localStorage.setItem(filename, data)
    }
}
const isNative = () => Capacitor.isNativePlatform()