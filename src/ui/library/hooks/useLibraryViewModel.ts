import { useProblemStore } from "@/application/store/useProblemStore"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { useLibraryQueryContext } from "@/ui/App/providers/QueryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useCallback, useEffect, useMemo, useState } from "react"
import { applyQuery } from "@/domain/problem/query/applyQuery"
import { useLibraryCheckbox } from "./useLibraryCheckbox"
import { useImportController } from "@/application/useImportControler"
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase"
import { useViewerDialog } from "@/ui/viewer/ViewDialog"
import { useBackupRestoreDialog } from "@/ui/common/dialogs/BackupRestoreDialog"
import { useProblemDetailDialog } from "@/ui/common/problemDetail/useProblemDetailDialog"
import { useMultipleProblemsTagEditDialog } from "@/ui/common/dialogs/MultipleProblemsTagEditDialog"

export function useLibraryViewModel() {
    const query = useLibraryQueryContext()
    const learningRecords = useLearningRecordStore(s => s.records)
    const toast = useToast()

    const {
        all: problems,
        reload,
        deleteProblems
    } = useProblemStore()

    // -----------------------------
    // ライブラリアイテム
    // -----------------------------
    const libraryItems = useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )
    const ids = useMemo(() => libraryItems.map(p => p.id), [libraryItems])
    
    // -----------------------------
    // ダイアログ
    // -----------------------------
    const detailDialog = useProblemDetailDialog()
    const viewerDialog = useViewerDialog()
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) reload()
    })
    const tagEditDialog = useMultipleProblemsTagEditDialog()
    
    // -----------------------------
    // 選択管理
    // -----------------------------
    const [checkboxMode, setCheckboxMode] = useState(false)
    const checkboxControl = useLibraryCheckbox(ids)
    const selection = useMemo(() => ({
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        isCheckboxMode: checkboxMode
    }), [checkboxControl.checkedIds, checkboxControl.isChecked, checkboxMode])

    // checkboxMode 切替時にチェック解除
    useEffect(() => {
        if (!checkboxMode) checkboxControl.uncheckAll()
    }, [checkboxMode])

    // -----------------------------
    // 操作ハンドラ
    // -----------------------------
    const selectActions = useMemo(() => ({
        selectAll: checkboxControl.checkAll,
        clearAll: checkboxControl.uncheckAll,
        toggleChecked: checkboxControl.toggleChecked,
        toggleCheckboxMode: () => setCheckboxMode(prev => !prev)
    }), [checkboxControl.checkAll, checkboxControl.uncheckAll, checkboxControl.toggleChecked])

    // -----------------------------
    // アイテムアクション
    // -----------------------------
    const itemActions = useMemo(() => ({
        editTags: (ids: ProblemId[]) => tagEditDialog.openDialog(ids),
        deleteChecked: async () => {
            const idsToDelete = checkboxControl.checkedIds
            if (!idsToDelete.length) return
            if (!window.confirm("Are you sure to delete selected?")) return
            const res = await deleteProblems(idsToDelete)
            toast({ message: `Deleted ${res} problems` })
        }
    }), [checkboxControl.checkedIds, deleteProblems, toast])

    // -----------------------------
    // インポート
    // -----------------------------
    const importer = useImportController(async (res: ImportFilesResult) => {
        await reload()
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`
        })
    })

    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const onItemClick = useCallback((p: Problem) => {
        if (selection.isCheckboxMode) {
            checkboxControl.toggleChecked(p.id)
        } else {
            detailDialog.openDialog(p.id)
        }
    }, [selection.isCheckboxMode, checkboxControl, detailDialog])
    
    return {
        ids,
        query,
        selection,
        selectActions,
        itemActions,
        onItemClick,
        importer,
        dialogs: {
            viewer: viewerDialog,
            detail: detailDialog,
            backupRestore: backupRestoreDialog,
            tagEdit: tagEditDialog,
        }
    }
}
