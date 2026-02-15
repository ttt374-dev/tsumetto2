import { useViewerDialog } from "@/ui/viewer/ViewDialog"
import type { useLibraryController } from "./useLibraryController"
import { useBackupRestoreDialog } from "@/ui/common/dialogs/BackupRestoreDialog"
import { useProblemDetailDialog } from "@/ui/common/problemDetail/useProblemDetailDialog"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { useMultipleProblemsTagEditDialog } from "@/ui/common/dialogs/MultipleProblemsTagEditDialog"
import type { LibraryCommand } from "./useLibraryViewModel"



export function useLibraryPresenter(commands: LibraryCommand) {
    // -----------------------------
    // ビューアーダイアログ
    // -----------------------------
    const viewerDialog = useViewerDialog()

    // -----------------------------
    // バックアップ / リストア
    // -----------------------------
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) commands.reload()
    })

    // -----------------------------
    // 問題詳細ダイアログ
    // -----------------------------
    const detailDialog = useProblemDetailDialog(
        //(id: ProblemId) => { viewerDialog.openDialog(id) },
        async (p: Problem) => { await commands.updateProblem(p) },
        async () => { await commands.reload() }
    )

    // -----------------------------
    // 複数問題タグ編集ダイアログ
    // -----------------------------
    const handleUpdateProblems = async (problems: Problem[]) => {
        // commands.updateProblem は VM 経由で呼ぶ
        for (const p of problems) {
            await commands.updateProblem(p)
        }
    }
    const tagEditDialog = useMultipleProblemsTagEditDialog(handleUpdateProblems)

    // -----------------------------
    // まとめて返す
    // -----------------------------
    const dialogs = {
        viewer: viewerDialog,
        detail: detailDialog,
        backupRestore: backupRestoreDialog,
        tagEdit: tagEditDialog,
    }

    return { dialogs, commands }
}
