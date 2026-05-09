import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell";
import BackupRestoreDialog from "@/ui/dialogs/BackupRestore/BackupRestoreDialog";
import { ImportDialog } from "@/ui/dialogs/Import/ImportDialog";


export function GlobalDialogs({ dialogs }: {
    dialogs: GlobalDialogControllers    
}) {
    return <>
        {dialogs.import.filesSelectElement}

        {dialogs.import.files &&
            <ImportDialog
                open={dialogs.import.open}
                onClose={dialogs.import.cancel}
                onImport={dialogs.import.confirm}
                filesToImport={dialogs.import.files}
            />}

        <BackupRestoreDialog
            open={dialogs.backupRestore.open}
            onClose={dialogs.backupRestore.closeDialog}
            onBackup={dialogs.backupRestore.backup}
            onRestore={dialogs.backupRestore.restore}
        /></>
}