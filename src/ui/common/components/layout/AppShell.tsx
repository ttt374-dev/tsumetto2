import { createContext } from "react"

import { AppLayout } from "./AppLayout"
import { useBackupRestoreDialogController, type BackupRestoreController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import { useImportWorkflow } from "@/ui/common/components/layout/useImportWorkflow";
import { useAppDrawerMenu } from "@/ui/common/components/layout/useAppDrawerMenu";
import { DrawerMenu } from "@/ui/common/components/layout/DrawerMenu";
import type { ImportController } from "@/ui/dialogs/Import/useImportController";
import { GlobalDialogs } from "@/ui/common/components/layout/GlobalDialogs";


interface Props {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    rightActions?: React.ReactNode;
    fab?: React.ReactNode;
    navigateBack?: boolean
}

type AppActions = {
    openImport: () => void
    openBackupRestore: () => void
}
export type GlobalDialogControllers = {
    import: ImportController
    backupRestore: BackupRestoreController
}

//export const OpenImportContext = createContext<(() => void) | null>(null)
export const AppActionsContext = createContext<AppActions | null>(null)

function useAppControllers() {
    const dialogs = {
        import: useImportWorkflow(),
        backupRestore: useBackupRestoreDialogController(),
    }
    const drawerController = useAppDrawerMenu(dialogs.import, dialogs.backupRestore)
    return { dialogs, drawerController }
}
function createAppActions(dialogs: GlobalDialogControllers): AppActions {
    return {
        openImport: dialogs.import.openFilesSelectDialog,
        openBackupRestore: dialogs.backupRestore.openDialog
    }
}
export function AppShell({ header, footer, rightActions, fab, children, navigateBack = false }: Props) {
    
    const { drawerController, dialogs } = useAppControllers()
    const drawer = !navigateBack ? (
        <DrawerMenu open={drawerController.open} menuItems={drawerController.menuItems} />
    ) : undefined
    const appActions = createAppActions(dialogs)
    // footer
    // 下部メニューで import を呼ぶため
    const resolvedFooter = footer &&
        <AppActionsContext.Provider value={appActions}>
            {footer}            
        </AppActionsContext.Provider>
    
    return (
        <>
            <AppLayout
                header={header}
                footer={resolvedFooter}
                rightActions={rightActions}
                fab={fab}
                onMenuClick={drawerController.openDrawer}
                drawer={drawer}
            >
                {children}
            </AppLayout>
            <GlobalDialogs dialogs={dialogs}/>
        </>
    )
}
