import type { ImportOptions } from "@/application/usecase/ImportProblemsUsecase";
import { routePaths } from "@/router/paths";
import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell";
import { ImportDialog } from "@/ui/dialogs/Import/ImportDialog";
import type { ImportController } from "@/ui/dialogs/Import/useImportController";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useNavigate } from "react-router-dom";


export function GlobalDialogsContainer({ dialogs }: {
    dialogs: GlobalDialogControllers    
}) {
    return <>
        <GlobalImportContainer importController={dialogs.import}/>
    </>
}

function GlobalImportContainer({ importController }: { importController: ImportController }) {
    const navigate = useNavigate()
    const startSession = useSessionStore(s => s.start)

    const handleImport = async (options: ImportOptions) => {
        const result = await importController.confirm(options)
        const ids = result.results.filter(r => r.status === "imported").map(r => r.problemId)
        startSession(createSessionId(), ids)
        navigate(routePaths.list, { state: { title: "imported kif files", ids: ids } })
    }
    return <>
        {importController.filesSelectElement}

        {importController.files &&
            <ImportDialog
                open={importController.open}
                onClose={importController.cancel}
                onImport={handleImport}
                filesToImport={importController.files}
            />}
    </>
}
