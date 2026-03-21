import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { DrawerMenu } from "./DrawerMenu";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useBackupRestoreDialog } from "../dialogs/BackupRestoreDialog";
import { routes } from "@/ui/App/useAppNavigation";
import { useImport } from "../../../Import/useImport";

interface Props {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    rightActions?: React.ReactNode;
    fab?: React.ReactNode;
    navigateBack?: boolean
}

export function AppShell({ header, footer, rightActions, fab, children, navigateBack = false }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const reload = useProblemStore(s => s.reload)
    const importer = useImport(async (res) => {
        await reload()
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`
        });
    });
    const backupRestoreDialog = useBackupRestoreDialog();
    //const drawer = undefined
    const drawer = !navigateBack ? (
                <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
                    onNavigateToMission={() => navigate(routes.mission)}
                    onNavigateToLibrary={() => navigate(routes.library)}
                    onNavigateToStats={()=>navigate(routes.stats)}
                    onNavigateToHistory={()=>navigate(routes.history)}
                    onImport={importer.openFilesSelectDialog}
                    onBackupRestore={backupRestoreDialog.openDialog}
                />
            ) : undefined

    return (
        <AppLayout
            header={header}
            footer={footer}
            rightActions={rightActions}
            fab={fab}
            onMenuClick={() => setDrawerOpen(true)}
            drawer={drawer}
        >

            {children}
            {importer.filesSelectElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppLayout>


    )
}
