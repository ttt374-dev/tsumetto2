import { Capacitor } from "@capacitor/core"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"

export interface BackupInternalStorage {
    read(filename: string): Promise<string>
    write(data: string, filename: string): Promise<void>
}

const capacitorInternalDataStorage: BackupInternalStorage = {
    async read(filename) {
        const text = await Filesystem.readFile({
            path: filename,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        })
        return text.data as string
        //return JSON.parse(text.data as string)
    },
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

const webInternalDataStorage: BackupInternalStorage = {
    async read(filename) {
        const data = localStorage.getItem(filename)
        if (data === null) {
            throw new Error(`Backup file not found: ${filename}`)
        }
        return data
    },
    async write(data: string, filename: string) {     
        localStorage.setItem(filename, data)
    
    }
}

export const internalDataStorage = 
    Capacitor.isNativePlatform()
        ? capacitorInternalDataStorage
        : webInternalDataStorage

