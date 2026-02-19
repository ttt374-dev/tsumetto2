import { useProblemStore } from "@/application/store/useProblemStore"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { useLibraryQueryContext } from "@/ui/App/providers/QueryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useCallback, useEffect, useMemo, useState } from "react"
import { applyQuery } from "@/domain/problem/query/applyQuery"
import { useLibraryCheckbox } from "./useLibraryCheckbox"
import { useBackupRestoreDialog } from "@/ui/common/dialogs/BackupRestoreDialog"
import { useProblemDetailDialog } from "@/ui/common/problemDetail/useProblemDetailDialog"
import { useMultipleProblemsTagEditDialog } from "@/ui/common/dialogs/MultipleProblemsTagEditDialog"
import type { LearningRecord } from "@/domain/learning/Learning"
import type { useQuery } from "@/application/useQuery"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"

function useLibraryListVM(problems: Problem[], learningRecords: LearningRecord, query: ReturnType<typeof useQuery>) {
    const libraryItems = useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )
    const ids = useMemo(() => libraryItems.map(p => p.id), [libraryItems])    
    console.log("library list", ids, libraryItems, problems)
    return { libraryItems, ids}
}
function useLibraryDialogVM(checkedIds: ProblemId[], reload: () => Promise<void>){
    const navigate = useNavigate()
    // -----------------------------
    // ダイアログ
    // -----------------------------
    const detailDialog = useProblemDetailDialog(
          () => { navigate(routes.library)}
    )
    //const viewerDialog = useViewerDialog()
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) reload()
    })
    const tagEditDialog = useMultipleProblemsTagEditDialog(checkedIds)

    return {
        //viewer: viewerDialog,
        detail: detailDialog,
        backupRestore: backupRestoreDialog,
        tagEdit: tagEditDialog,
    }
}
function useLibrarySelectionVM(ids: ProblemId[]){
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

    const actions = useMemo(()=>({
        selectAll: checkboxControl.checkAll,
        clearAll: checkboxControl.uncheckAll,
        toggleChecked: checkboxControl.toggleChecked,
        toggleCheckboxMode: () => setCheckboxMode(prev => !prev)
    }), [checkboxControl.checkAll, checkboxControl.uncheckAll, checkboxControl.toggleChecked])
    // checkboxMode 切替時にチェック解除
    useEffect(() => {
        if (!checkboxMode) checkboxControl.uncheckAll()
    }, [checkboxMode, checkboxControl.uncheckAll])

    return  {...selection, ...actions}
}
function useLibraryCommands(){
    const problems = useProblemStore(s => s.activeProblems)
    const reload = useProblemStore(s => s.reload)
    const deleteProblems = useProblemStore(s => s.deleteProblems)

    return { problems, reload, deleteProblems }
}
/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useLibraryQueryContext()
    const learningRecords = useLearningRecordStore(s => s.records)
    const toast = useToast()

    const { problems, reload, deleteProblems } = useLibraryCommands()
    const { libraryItems, ids } = useLibraryListVM(problems, learningRecords, query)
    
    const selection = useLibrarySelectionVM(ids)
    const dialogs = useLibraryDialogVM(selection.checkedIds, reload)
    // -----------------------------
    // アイテムアクション
    // -----------------------------
    const itemActions = useMemo(() => ({
        editTags: (ids: ProblemId[]) => dialogs.tagEdit.openDialog(ids),
        deleteChecked: async (confirmFn: () => boolean) => {
            const idsToDelete = selection.checkedIds
            if (!idsToDelete.length || !confirmFn()) return            
            const res = await deleteProblems(idsToDelete)
            toast({ message: `Deleted ${res} problems` })
        }
    }), [selection.checkedIds, deleteProblems, toast, dialogs.tagEdit])

    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const onItemClick = useCallback((p: Problem) => {
        if (selection.isCheckboxMode) {
            selection.toggleChecked(p.id)
        } else {
            dialogs.detail.openDialog(p.id)
        }
    }, [selection.isCheckboxMode, selection.toggleChecked, dialogs.detail])
    
    return {
        ids,
        libraryItems,
        query,
        selection,        
        itemActions,
        onItemClick,
        //importer,
        dialogs
    }
}
