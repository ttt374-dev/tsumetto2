import { ImportDialog } from "@/ui/dialogs/Import/ImportDialog";
import type { useImportController } from "@/ui/dialogs/Import/useImportController";

export function ImportUI({ controller }: {
    controller: ReturnType<typeof useImportController>
}) {
    return (
        <>
            {controller.filesSelectElement}

            { controller.files &&
            <ImportDialog
                open={controller.open}
                onClose={controller.cancel}
                onImport={controller.confirm}
                filesToImport={controller.files}
            />}
        </>
    )
}