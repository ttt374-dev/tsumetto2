import { createContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { DrawerMenu } from "./DrawerMenu";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useBackupRestoreDialog } from "../../../dialogs/BackupRestoreDialog";
import { routes } from "@/ui/App/useAppNavigation";
import { useImportController } from "../../../dialogs/Import/useImportController";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore";
import { ImportUI } from "@/ui/dialogs/Import/ImportUI";
import FooterNavigation from "@/ui/common/components/FooterNavigation";

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
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()
    const startSession = useSessionStore(s=>s.start)
    const importer = useImportController();
    
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

    const reload = useProblemStore(s => s.reload)
    useEffect(() => {
        if (!importer.result) return
        reload()
        toast({
            message: `imported: ${importer.result.summary.imported}, skipped: ${importer.result.summary.skipped}, failed: ${importer.result.summary.failed}`
        });

        const ids = importer.result.results.filter(r => r.status === "imported").map(r => r.problemId)
        startSession("IMPORTED-KIF", ids)
        navigate(routes.list, { state: { title: "imported kif files", ids: ids } })
    }, [importer.result])

    const resolvedFooter = footer &&
        <OpenImportContext.Provider value={importer.openFilesSelectDialog}>
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
            {backupRestoreDialog.dialogElement}
            <ImportUI controller={importer} />
        </AppLayout>

    )
}
