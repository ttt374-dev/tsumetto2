import { createContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { DrawerMenu } from "./DrawerMenu";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import { useImportController } from "../../../dialogs/Import/useImportController";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { ImportUI } from "@/ui/dialogs/Import/ImportUI";
import { useBackupRestoreDialog } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalog";
import BackupRestoreDialog from "@/ui/dialogs/BackupRestore/BackupRestoreDialog";

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
    const navigate = useNavigate()
    const toast = useToast()

    const importController = useImportController();
    const backupRestoreDialog = useBackupRestoreDialog()

    // drawer
    const [drawerOpen, setDrawerOpen] = useState(false)
    const drawer = !navigateBack ? (
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
            onNavigateToMission={() => navigate(routes.mission)}
            onNavigateToLibrary={() => navigate(routes.library)}
            onNavigateToStats={() => navigate(routes.stats)}
            onNavigateToHistory={() => navigate(routes.history)}
            onImport={importController.openFilesSelectDialog}
            onBackupRestore={backupRestoreDialog.openDialog}
        />
    ) : undefined

    // import
    const reload = useProblemStore(s => s.reload)
    const startSession = useSessionStore(s => s.start)
    useEffect(() => {
        if (!importController.result) return
        reload()
        toast({
            message: `imported: ${importController.result.summary.imported}, skipped: ${importController.result.summary.skipped}, failed: ${importController.result.summary.failed}`
        });

        const ids = importController.result.results.filter(r => r.status === "imported").map(r => r.problemId)
        startSession(createSessionId(), ids)
        navigate(routes.list, { state: { title: "imported kif files", ids: ids } })
    }, [importController.result])

    const resolvedFooter = footer &&
        <OpenImportContext.Provider value={importController.openFilesSelectDialog}>
            {footer}
        </OpenImportContext.Provider>
    return (
        <AppLayout
            header={header}
            footer={resolvedFooter}
            rightActions={rightActions}
            fab={fab}
            onMenuClick={() => setDrawerOpen(true)}
            drawer={drawer}
        >

            {children}

            <ImportUI controller={importController} />
            <BackupRestoreDialog
                open={backupRestoreDialog.open}
                onClose={backupRestoreDialog.closeDialog}
                onBackup={backupRestoreDialog.backup}
                //onRestore={backupRestoreDialog.restore}
                controller={backupRestoreDialog.controller}
                onResult={backupRestoreDialog.setResult}
            />
        </AppLayout>

    )
}
