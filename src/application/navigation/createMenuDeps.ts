import { useNavigate } from "react-router-dom"
import type { MenuCommand, MenuCommandDeps } from "@/application/navigation/types"
import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell"

export function createMenuDeps(dialogs: GlobalDialogControllers): MenuCommandDeps {
    const navigate = useNavigate()
    return {
        navigate,
        //openImportDialog: dialogs.import.openFilesSelectDialog,
        //openBackupRestoreDialog: dialogs.backupRestore.openDialog,
        
        dialogs: {
            "import": {
                openDialog: dialogs.import.openFilesSelectDialog
            },
            "backupRestore": {
                openDialog: dialogs.backupRestore.openDialog
            }
        }
    }
}