import { useRef, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Divider } from "@mui/material"

import { type BackupResult, type RestoreResult } from "@/application/usecase/BackupRestoreUsecase"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"

///////////////////////////////////////////////////
export default function BackupRestoreDialog({ open, onClose, onBackup, onRestore}: { 
    open: boolean
    onClose: () => void
    onBackup: () => Promise<BackupResult>
    onRestore: (file: File) => Promise<RestoreResult>
}) {
    const repos = useRepositoryContext()
    //const usecase = useBackupRestoreUsecase(repos.problem, repos.reviewEvent, repos.mission, fileBackupWriter)
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* ===== backup ===== */
    const handleBackup = async () => {
        const res = await onBackup()       
        if (res.ok) onClose()
    }

    /* ===== restore ===== */
    const handleRestoreFile = async (file: File) => {
        if (!window.confirm("現在のデータは上書きされます。よろしいですか？")) return
        const res = await onRestore(file)
        if (res.ok) onClose()
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

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )
}