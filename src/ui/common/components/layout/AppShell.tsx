import { createContext } from "react"

import { AppLayout } from "./AppLayout"
import { useBackupRestoreDialogController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import { useImportWorkflow } from "@/ui/common/components/layout/useImportWorkflow";
import { GlobalDialogs } from "@/ui/common/components/layout/GlobalDialogs";
import { useAppDrawerMenu } from "@/ui/common/components/layout/useAppDrawerMenu";
import { DrawerMenu } from "@/ui/common/components/layout/DrawerMenu";


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

//export const OpenImportContext = createContext<(() => void) | null>(null)
export const AppActinosContext = createContext<AppActions | null>(null)

function useAppControllers() {
    const importController = useImportWorkflow()
    const backupRestoreDialog = useBackupRestoreDialogController()
    //console.log("backupres", backupRestoreDialogController.open)
    // drawer
    const drawerController = useAppDrawerMenu(
        importController,
        backupRestoreDialog
    )


    return { importController, backupRestoreDialog, drawerController }
}
export function AppShell({ header, footer, rightActions, fab, children, navigateBack = false }: Props) {
    const { importController, backupRestoreDialog, drawerController } = useAppControllers()
    const drawer = !navigateBack ? (
        <DrawerMenu open={drawerController.open} menuItems={drawerController.menuItems} />
    ) : undefined

    const appActions: AppActions = {
        openImport: importController.openFilesSelectDialog,
        openBackupRestore: backupRestoreDialog.openDialog
    }
    // footer
    // 下部メニューで import を呼ぶため
    const resolvedFooter = footer &&
        <AppActinosContext.Provider value={appActions}>
            {footer}            
        </AppActinosContext.Provider>
    
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
            <GlobalDialogs
                importController={importController}
                backupRestoreController={backupRestoreDialog} />
        </>
    )
}
