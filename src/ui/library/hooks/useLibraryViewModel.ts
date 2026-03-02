import { useProblemStore } from "@/ui/store/useProblemStore"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useCallback, useEffect, useMemo, useState } from "react"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useLibraryCheckbox } from "./useLibraryCheckbox"
import { useProblemDetailDialog } from "@/ui/common/components/dialogs/problemDetail/useProblemDetailDialog"
import type { useQuery } from "@/ui/common/hooks/useQuery"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import type { LearningRecord } from "@/domain/learning/entity/Learning"
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog"
import { useMultipleProblemsTagEditDialog } from "@/ui/common/components/dialogs/MultipleProblemsTagEditDialog"
import { useQueryStore } from "@/ui/store/useQueryStore"
import type { SortState } from "@/domain/problem/service/query/sort"
import type { FilterState } from "@/domain/problem/service/query/filter"
import { useMultipleProblemsEditoDialog } from "@/ui/common/components/dialogs/MultipleProblemsEditorDialog"


export type LibraryActionMode = "selection" | "view" 

function useLibraryListVM(problems: Problem[], learningRecords: LearningRecord, sortState: SortState, filterState: FilterState) {
    const libraryItems = useMemo(() =>
        applyQuery(problems, learningRecords, sortState, filterState),
        [problems, learningRecords, sortState, filterState]
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
    const backupRestoreDialog = useBackupRestoreDialog()
    //const tagEditDialog = useMultipleProblemsTagEditDialog(checkedIds)
    const tagEditDialog = useMultipleProblemsEditoDialog()

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
    //const [checkboxMode, setCheckboxMode] = useState(false)
    const checkboxControl = useLibraryCheckbox(ids)
    const selection = useMemo(() => ({
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        //isCheckboxMode: checkboxMode
    }), [checkboxControl.checkedIds, checkboxControl.isChecked])

    const actions = useMemo(()=>({
        selectAll: checkboxControl.checkAll,
        clearAll: checkboxControl.uncheckAll,
        toggleChecked: checkboxControl.toggleChecked,
        //toggleCheckboxMode: () => setCheckboxMode(prev => !prev)
    }), [checkboxControl.checkAll, checkboxControl.uncheckAll, checkboxControl.toggleChecked])
    /*
    // checkboxMode 切替時にチェック解除
    useEffect(() => {
        if (!checkboxMode) checkboxControl.uncheckAll()
    }, [actionMode, checkboxControl.uncheckAll])
*/
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
    //const query = useLibraryQueryContext()
    const query = useQueryStore()

    const learningRecords = useLearningRecordStore(s => s.records)
    const [actionMode, setActionMode] = useState<LibraryActionMode>("view")
    const toast = useToast()

    const { problems, reload, deleteProblems } = useLibraryCommands()
    const { libraryItems, ids } = useLibraryListVM(problems, learningRecords, query.sort.state, query.filter.state)
    
    const selection = useLibrarySelectionVM(ids)
    const dialogs = useLibraryDialogVM(selection.checkedIds, reload)
    // アクションモード
    const changeActionMode = (mode: LibraryActionMode) => {
        setActionMode(mode)
        selection.clearAll()
    }
    /*
    useEffect(()=>{
        selection.clearAll()
    }, [actionMode])
}*/
    // -----------------------------
    // アイテムアクション
    // -----------------------------
    const itemActions = useMemo(() => ({
        openTagEditDialog: (ids: ProblemId[]) => dialogs.tagEdit.openDialog(ids),
        deleteChecked: () => {
            const idsToDelete = selection.checkedIds
            if (!idsToDelete.length) return
            return deleteProblems(idsToDelete)
        }
        /*
        deleteChecked: async (confirmFn: () => boolean) => {
            const idsToDelete = selection.checkedIds
            if (!idsToDelete.length || !confirmFn()) return            
            const res = deleteProblems(idsToDelete)
            toast({ message: `Deleted ${res} problems` })
        }*/
    }), [selection.checkedIds, deleteProblems, toast, dialogs.tagEdit])

    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const navigate = useNavigate()
    const onItemClick = useCallback((p: Problem) => {
        
        switch(actionMode){
            case "selection":
                selection.toggleChecked(p.id)
                break;
            /*case "detail":
                dialogs.detail.openDialog(p.id)    
                break*/
            case "view":
                //navigate(routes.problemView(p.id))
                navigate(routes.player(p.id))
        }
        
    }, [actionMode, selection.toggleChecked, dialogs.detail])
    
    /////////////////////////////////////////
    return {
        ids,
        libraryItems,
        query,
        mode: actionMode, changeActionMode,
        selection,        
        itemActions,
        onItemClick,
        //importer,
        dialogs
    }
}
