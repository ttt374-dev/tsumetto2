import { useRef, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Divider } from "@mui/material"

import { useBackupRestoreUsecase, type BackupData, type BackupResult, type RestoreResult } from "@/application/usecase/problem/backup/BackupRestoreUsecase"
import { fileBackupWriter } from "@/infrastructure/fileBackupWriter"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import type { useBackupRestoreController } from "@/ui/dialogs/BackupRestore/useBackupRestoreController"


///////////////////////////////////////////////////
export default function BackupRestoreDialog({ open, onClose, controller, onResult }: { 
    open: boolean
    onClose: () => void
    controller: ReturnType<typeof useBackupRestoreController>
    onResult: (result: { type: "backup" | "restore"; data: any }) => void
    //onBackupFinished?: (res: BackupResult) => void
    //onRestoreFinished?: (res: RestoreResult) => void
}) {
    const repos = useRepositoryContext()
    const usecase = useBackupRestoreUsecase(repos.problem, repos.reviewEvent, repos.mission, fileBackupWriter)
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* ===== backup ===== */   
    const handleBackup = async () => {
        const result = await usecase.backup()            
        //onBackupFinished?.(result)        
        onResult({type: "backup", data: result})
        if (result.ok) onClose()
    }

    /* ===== restore ===== */
    const handleRestoreFile = async (file: File) => {
        if (!window.confirm("現在のデータは上書きされます。よろしいですか？")) return

        const res = await controller.restoreFromFile(file)
        onResult({ type: "restore", data: res })
        onClose()
    }
    /* ==== data clear ==== */    
    const handleClearAllReviewEvents = () => {
        if (!window.confirm("すべての学習データを消去してよろしいですか？")) return
        controller.clearAll()
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