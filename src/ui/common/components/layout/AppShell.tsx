import { createContext } from "react"

import { AppLayout } from "./AppLayout"
import { useBackupRestoreController, type BackupRestoreController } from "@/ui/screens/maintenance/useBackupRestoreController";
import { useImportWorkflow } from "@/ui/common/components/layout/hooks/useImportWorkflow";
import type { ImportController } from "@/ui/dialogs/Import/useImportController";
import { GlobalDialogsContainer } from "@/ui/common/components/layout/GlobalDialogsContainer";
import { useDrawerState } from "@/ui/common/hooks/useDrawerState";
import { DrawerMenu } from "@/ui/common/components/layout/DrawerMenu";
import type { MenuCommand } from "@/application/navigation/types";
import { executeMenuCommand } from "@/application/navigation/executeMenuCommand";
import { createMenuDeps } from "@/application/navigation/createMenuDeps";
import { menuItems } from "@/application/navigation/menuItems";
import FooterNavigation from "@/ui/common/components/FooterNavigation";

interface Props {
    header?: React.ReactNode;
    showBottomNav?: boolean;
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
    //backupRestore: BackupRestoreController
}

//export const OpenImportContext = createContext<(() => void) | null>(null)
//export const AppActionsContext = createContext<AppActions | null>(null)

function useAppControllers() {
    const dialogs = {
        import: useImportWorkflow(),
        backupRestore: useBackupRestoreController(),
    }
    return { dialogs }
}

//////////////////////////////////////////////
export function AppShell({ header, showBottomNav, footer, rightActions, fab, children, navigateBack = false }: Props) {    
    const { dialogs } = useAppControllers()
    const drawer = useDrawerState()    
    const menuDeps = createMenuDeps(dialogs)    
    const handleMenuCommand = (cmd: MenuCommand) => {            
        executeMenuCommand(cmd, menuDeps)        
    }        
    const resolvedFooter = showBottomNav ? 
        <FooterNavigation onCommand={handleMenuCommand}/> :  footer
    const drawerMenu = !navigateBack &&
        <DrawerMenu
            open={drawer.open}
            onClose={drawer.closeDrawer}
            menuItems={menuItems}
            onCommand={cmd => { handleMenuCommand(cmd); drawer.closeDrawer() }}
        />
     
    return (
        <>
            <AppLayout
                header={header}
                footer={resolvedFooter}
                rightActions={rightActions}
                fab={fab}
                onMenuClick={drawer.openDrawer}
                drawer={drawerMenu}
            >
                {children}
            </AppLayout>
            <GlobalDialogsContainer dialogs={dialogs}/>
        </>
    )
}
