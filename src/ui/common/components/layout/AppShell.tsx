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

export const OpenImportContext = createContext<(() => void) | null>(null)

export function AppShell({ header, footer, rightActions, fab, children, navigateBack = false }: Props) {
    // dialog controllers
    const importController = useImportWorkflow()
    const backupRestoreDialogController = useBackupRestoreDialogController()
    //console.log("backupres", backupRestoreDialogController.open)
    // drawer
    const drawerController = useAppDrawerMenu(
        importController,
        backupRestoreDialogController
    )
    const drawer = !navigateBack ? (
        <DrawerMenu open={drawerController.open} menuItems={drawerController.menuItems} />
    ) : undefined

    // footer
    const resolvedFooter = footer &&
        <OpenImportContext.Provider value={importController.openFilesSelectDialog}>
            {footer}
        </OpenImportContext.Provider>
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
            <GlobalDialogs importController={importController} backupRestoreController={backupRestoreDialogController} />
        </>
    )
}

