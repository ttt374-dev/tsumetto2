import { useRef } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Divider } from "@mui/material"
import { useToast } from "../App/providers/ToastProvider"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { createBackupRestoreUsecase, type BackupData } from "@/usecase/backupRestoreUsecase"
import { fileBackupWriter } from "@/infra/fileBackupWriter"


type DialogProps = {
    open: boolean
    onClose: () => void
}

export const useBackupRestore = () => {
    const repos = useRepositoryContext()
    //const store = useStoreContext()

    const usecase = createBackupRestoreUsecase(repos.problem, repos.learningEvent, fileBackupWriter)
    const backup = async () => {
        await usecase.backup()        
    }
    const restore = async (data: BackupData) => {
        await usecase.restore(data)
        //await store.reload()        
    }
    return {
        backup, restore
    }    
}
///////////////////////////////////////////////////
export default function BackupRestoreDialog({ open, onClose }: DialogProps) {
    const { backup, restore } = useBackupRestore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()

    /* ===== backup ===== */   
    const handleBackup = async () => {
        try {
            const result = await backup()
            //toast({message: `バックアップ完了しました(${result.filename}): problem: ${result.count.problem}件, learing: ${result.count.learning}件`})
            onClose()
        } catch (e){
            const message = e instanceof Error ? e.message :  "バックアップエラー"
            toast({message: message, severity: "error"})
        }
        
    }

    /* ===== restore ===== */
    const handleRestoreFile = async (file: File) => {
        try {
            const text = await file.text()
            const json = JSON.parse(text)

            if (!window.confirm("現在の棋譜・学習履歴はすべて上書きされます。よろしいですか？")) {
                return
            }
            const result = await restore(json)           

            //toast({ message: `リストア完了しました: problem: ${result.count.problem}件, learing: ${result.count.learning}件` })

            onClose()
        } catch (e) {
            const message = e instanceof Error ? e.message :  "リストアエラー"
            toast({message: message, severity: "error"})
        }

    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>バックアップ / 復元</DialogTitle>

            <DialogContent>
                {/* backup */}
                <Box mb={3}>
                    <Typography variant="h6">バックアップ</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        棋譜ライブラリと学習履歴を JSON ファイルとして保存します。
                    </Typography>
                    <Button variant="contained" onClick={handleBackup}>
                        バックアップを保存
                    </Button>
                </Box>

                <Divider />

                {/* restore */}
                <Box mt={3}>
                    <Typography variant="h6">復元</Typography>
                    <Typography variant="body2" color="error" mb={1}>
                        復元すると現在のデータはすべて上書きされます。
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        バックアップを読み込む
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleRestoreFile(file)
                            e.currentTarget.value = ""
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )
}