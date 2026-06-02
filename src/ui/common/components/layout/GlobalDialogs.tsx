import type { ImportOptions } from "@/application/usecase/ImportProblemsUsecase";
import { routes } from "@/ui/App/useAppNavigation";
import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell";
import BackupRestoreDialog from "@/ui/dialogs/BackupRestore/BackupRestoreDialog";
import { ImportDialog } from "@/ui/dialogs/Import/ImportDialog";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useNavigate } from "react-router-dom";


export function GlobalDialogs({ dialogs }: {
    dialogs: GlobalDialogControllers    
}) {
    const navigate = useNavigate()
    const startSession = useSessionStore(s => s.start)

    const handleImport = async (options: ImportOptions) => {
       const result = await dialogs.import.confirm(options)       
       const ids = result.results.filter(r => r.status === "imported").map(r => r.problemId)
        startSession(createSessionId(), ids)
        navigate(routes.list, { state: { title: "imported kif files", ids: ids } })
    }
    return <>
        {dialogs.import.filesSelectElement}

        {dialogs.import.files &&
            <ImportDialog
                open={dialogs.import.open}
                onClose={dialogs.import.cancel}
                onImport={handleImport}
                filesToImport={dialogs.import.files}
            />}

        <BackupRestoreDialog
            open={dialogs.backupRestore.open}
            onClose={dialogs.backupRestore.closeDialog}
            onBackup={dialogs.backupRestore.backup}
            onRestore={dialogs.backupRestore.restore}
        /></>
}