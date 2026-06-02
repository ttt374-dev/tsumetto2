import { useHardDeleteUsecase } from "@/application/usecase/HardDeleteUsecase";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useBackupRestoreDialogController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import { Box, Button, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/material";
import { useRef } from "react";


export function MaintenanceScreen(){
    const toast = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const backupRestoreController = useBackupRestoreDialogController()
    const executeHardDelete = useHardDeleteUsecase()
    const handleBackup = async () => { 
        await backupRestoreController.backup()
    }
    const handleRestoreFile = async (file: File) => {
        if (!window.confirm("現在のデータは上書きされます。よろしいですか？")) return
        const res = await backupRestoreController.restore(file)
        //const res = await onRestore(file)
        //if (res.ok) onClose()
    }
   
    const handleHardDelete = async () => {
        if (!window.confirm("よろしいですか？")) return
        const deletedCount = await executeHardDelete()
        toast({message: `${deletedCount}件物理削除されました`})
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

                <Box my={3}>
                    <Typography variant="h6">ハードデリート</Typography>
                    <Typography variant="body2" color="error" mb={1}>
                        削除マークのついた問題群を物理削除
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleHardDelete}
                    >
                        物理的削除
                    </Button>

                </Box>
            </Stack>
        </AppShell>
    )
}