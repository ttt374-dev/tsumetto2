import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { DrawerMenu } from "./DrawerMenu";
import { useImportController } from "@/application/useImportControler";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useBackupRestoreDialog } from "../dialogs/BackupRestoreDialog";

interface Props {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    rightActions?: React.ReactNode;
    fab?: React.ReactNode;
}

export function AppShell({ header, footer, rightActions, fab, children }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const reload = useProblemStore(s => s.reload)
    const importer = useImportController(async (res) => {
        await reload()
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`
        });
    });
    const backupRestoreDialog = useBackupRestoreDialog(res => {
        if (res.ok) reload();
    });

    return (

        <AppLayout
            header={header}
            footer={footer}
            rightActions={rightActions}
            fab={fab}
            onMenuClick={() => setDrawerOpen(true)}
            drawer={
                <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
                    onNavigateToDashboard={() => navigate("/")}
                    onNavigateToLibrary={() => navigate("/library")}
                    onImport={importer.openFileDialog}
                    onBackupRestore={backupRestoreDialog.openDialog}
                />
            }
        >

            {children}
            {importer.pickerElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppLayout>


    )
}
