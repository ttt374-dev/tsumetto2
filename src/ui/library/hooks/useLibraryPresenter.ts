import { useViewerDialog } from "@/ui/viewer/ViewDialog"
import type { useLibraryController } from "./useLibraryController"
import { useBackupRestoreDialog } from "@/ui/common/dialogs/BackupRestoreDialog"
import { useProblemDetailDialog } from "@/ui/common/problemDetail/useProblemDetailDialog"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { useMultipleProblemsTagEditDialog } from "@/ui/common/dialogs/MultipleProblemsTagEditDialog"
import type { LibraryCommand } from "../LibraryScreen"


export function useLibraryPresenter (commands: LibraryCommand){
     // dialogs
    const viewerDialog = useViewerDialog()
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) commands.reload()
    })
    const detailDialog = useProblemDetailDialog(
        (id: ProblemId) => { viewerDialog.openDialog(id) },
        async (p: Problem) => {
            await commands.updateProblem(p)
        }, async () => { await commands.reload() }
    )
    const handleUpdateProblems = async (problems: Problem[]) => {
        for (const p of problems) {
            await commands.updateProblem(p)
        }
    }
    const tagEditDialog = useMultipleProblemsTagEditDialog(handleUpdateProblems)
    const dialogs = {
        viewer: viewerDialog,
        detail: detailDialog,
        backupRestore: backupRestoreDialog,
        tagEdit: tagEditDialog,
    }
    return { dialogs }
}