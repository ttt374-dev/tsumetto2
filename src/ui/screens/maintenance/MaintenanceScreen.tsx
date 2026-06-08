import { createCleanupresetReviewEvent } from "@/application/usecase/CleanupResetReviewEvent";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useBackupRestoreController } from "@/ui/screens/maintenance/useBackupRestoreController";
import { Box, Button, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/material";
import { useRef } from "react";

export function MaintenanceScreen(){
    const toast = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const backupRestoreController = useBackupRestoreController()
    const repos = useRepositoryContext()
    const deleteHardDelete = repos.problem.hardDeleteDeleted
    const executeCleanupResetReviewEvents = createCleanupresetReviewEvent(repos.reviewEvent)
    
    const handleBackup = async () => { 
        await backupRestoreController.backup()
    }
    const handleRestoreFile = async (file: File) => {
        if (!window.confirm("現在のデータは上書きされます。よろしいですか？")) return
        await backupRestoreController.restore(file)
    }    
    const handleRestoreAutoBackup = async () => {
        if (!window.confirm("現在のデータは上書きされます。よろしいですか？")) return
        await backupRestoreController.restoreAutoBackup()
    }    
    const handleCleanup = async () => {
        if (!window.confirm("よろしいですか？")) return
        const deletedProblemsCount = await deleteHardDelete()
        const deletedReviewEventsCount = await executeCleanupResetReviewEvents()
        toast({message: `問題済${deletedProblemsCount}件, リセット以前イベント${deletedReviewEventsCount}件　削除されました`})
    }
    return (
        <AppShell
            header={"maintenace"}
            showBottomNav={true}
        >
            <Stack direction="column">
                <Box mb={3}>
                    <Typography variant="h6">バックアップ</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        棋譜ライブラリと学習履歴を JSON ファイルとして保存します。
                    </Typography>
                    <Button variant="contained" onClick={handleBackup}>
                        バックアップを保存
                    </Button>
                </Box>

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
                        バックアップファイルを選択して読み込む
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
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRestoreAutoBackup}
                    >
                        自動バックアップファイルを読み込む
                    </Button>
                </Box>
                <Divider />
                <Box my={3}>
                    <Typography variant="h6">クリーンアップ</Typography>
                    <Typography variant="body2" color="error" mb={1}>
                        削除マークのついた問題群を物理削除
                    </Typography>
                    <Typography variant="body2" color="error" mb={1}>
                        リセット以前の習得データをクリア件
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleCleanup}
                    >
                        物理的削除
                    </Button>

                </Box>
            </Stack>
        </AppShell>
    )
}