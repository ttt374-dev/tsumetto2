import { createContext } from "react"

import { AppLayout } from "./AppLayout"
import { useBackupRestoreDialogController, type BackupRestoreController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import { useImportWorkflow } from "@/ui/common/components/layout/useImportWorkflow";
import { DrawerMenu } from "@/ui/common/components/layout/DrawerMenu";
import type { ImportController } from "@/ui/dialogs/Import/useImportController";
import { GlobalDialogs } from "@/ui/common/components/layout/GlobalDialogs";
import { AppDrawerMenu } from "@/ui/common/components/layout/AppDrawerMenu";
import { useDrawerState } from "@/ui/common/components/layout/useDrawerState";


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
    return { dialogs }
}
function createAppActions(dialogs: GlobalDialogControllers): AppActions {
    return {
        openImport: dialogs.import.openFilesSelectDialog,
        openBackupRestore: dialogs.backupRestore.openDialog
    }
}
//////////////////////////////////////////////
export function AppShell({ header, footer, rightActions, fab, children, navigateBack = false }: Props) {
    
    const { dialogs } = useAppControllers()
    const drawer = useDrawerState()    
    
    // footer
    // 下部メニューで import を呼ぶため
    const appActions = createAppActions(dialogs)
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
                onMenuClick={drawer.openDrawer}
                drawer={!navigateBack && 
                    <AppDrawerMenu open={drawer.open} dialogs={dialogs}/>}
            >
                {children}
            </AppLayout>
            <GlobalDialogs dialogs={dialogs}/>
        </>
    )
}
