import { useRef, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Divider } from "@mui/material"

import { useBackupRestoreUsecase, type BackupData, type BackupResult, type RestoreResult } from "@/application/usecase/problem/backup/BackupRestoreUsecase"
import { fileBackupWriter } from "@/infrastructure/fileBackupWriter"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/domains/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/domains/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"

export function useBackupRestoreDialog(){
    const [open, setOpen] = useState(false)
    const toast = useToast()
    const openDialog = () => { setOpen(true)}
    const reloadProblems = useProblemStore(s=>s.reload)    
    const reloadReviewEvents = useReviewEventStore(s=>s.reload)
    const reloadMissions = useMissionStore(s=>s.reload)

    const reloadStores = () => { 
        reloadProblems()
        reloadReviewEvents()
        reloadMissions()
    }
    const dialogElement = (
        <BackupRestoreDialog open={open}
            onBackupFinished={(res) => {
                if (res.ok)
                    toast({ message: `${res.value.problemCount}件を${res.value.filename}にバックアップしました` })
                else
                    toast({ message: `バックアップに失敗しました：${res.error.code}`, severity: "error" })
            }}
            onRestoreFinished={(res) => {
                if (res.ok) {
                    toast({ message: `${res.value.problemCount}件をリストアしました` })
                    reloadStores()
                } else {
                    toast({ message: `リストアに失敗しました：${res.error.code}`, severity: "error" })
                }
                
            }}
            onClose={() => { setOpen(false) }} />
    )

    return { openDialog, dialogElement}
}

///////////////////////////////////////////////////
export default function BackupRestoreDialog({ open, onClose, onBackupFinished, onRestoreFinished }: { 
    open: boolean
    onClose: () => void
    onBackupFinished?: (res: BackupResult) => void
    onRestoreFinished?: (res: RestoreResult) => void
}) {
    const repos = useRepositoryContext()
    const usecase = useBackupRestoreUsecase(repos.problem, repos.reviewEvent, repos.mission, fileBackupWriter)
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* ===== backup ===== */   
    const handleBackup = async () => {
        const result = await usecase.backup()            
        onBackupFinished?.(result)        
        if (result.ok) onClose()
    }

    /* ===== restore ===== */
    const handleRestoreFile = async (file: File) => {
        let json: BackupData

        try {
            const text = await file.text()
            json = JSON.parse(text)
        } catch {
            onRestoreFinished?.({
                ok: false,
                error: { code: "invalid-format"}
            })
            return
        }
        if (!window.confirm(
            "現在の棋譜・学習履歴はすべて上書きされます。よろしいですか？"
        )) {
            return
        }
        const result = await usecase.restore(json)
        onClose()
        onRestoreFinished?.(result)
    }
    /* ==== data clear ==== */
    const clearAllEvents = useReviewEventStore(s=>s.clearAll)
    const handleClearAllReviewEvents = () => {
        if (!window.confirm("すべての学習データを消去してよろしいですか？")) return
        clearAllEvents()
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
                <Box my={3}>
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

                <Divider />

                { /* データクリア */ }
                <Box my={3}>
                    <Typography variant="h6">データクリア</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        すべての学習データログが削除されます。
                    </Typography>
                    <Button onClick={handleClearAllReviewEvents} 
                        color="error" variant="outlined">
                        全学習データ消去
                    </Button>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )
}