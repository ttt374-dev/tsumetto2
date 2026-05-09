import BackupRestoreDialog from "@/ui/dialogs/BackupRestore/BackupRestoreDialog";
import { useBackupRestoreDialogController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import { ImportDialog } from "@/ui/dialogs/Import/ImportDialog";
import { ImportUI } from "@/ui/dialogs/Import/ImportUI";
import type { useImportController } from "@/ui/dialogs/Import/useImportController";


export function GlobalDialogs({ importController, backupRestoreController }: {
    importController: ReturnType<typeof useImportController>
    backupRestoreController: ReturnType<typeof useBackupRestoreDialogController>
}) {
    return <>
        {importController.filesSelectElement}

        {importController.files &&
            <ImportDialog
                open={importController.open}
                onClose={importController.cancel}
                onImport={importController.confirm}
                filesToImport={importController.files}
            />}

        <BackupRestoreDialog
            open={backupRestoreController.open}
            onClose={backupRestoreController.closeDialog}
            onBackup={backupRestoreController.backup}
            onRestore={backupRestoreController.restore}
        /></>
}