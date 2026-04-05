import { useToast } from "@/ui/App/providers/ToastProvider"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"

import { selectActiveProblems, useProblemStore } from "@/ui/store/useProblemStore"
import { useLearningRecordStore } from "@/ui/domains/learning/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useLibraryCheckbox } from "./useLibraryCheckbox"
import type { LearningRecord } from "@/domain/learning/entity/Learning"
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog"
import { useMultipleProblemsEditDialog } from "@/ui/common/components/dialogs/MultipleProblemsEditorDialog"
import type { QueryState } from "@/domain/problem/service/query/ProblemsQuery"
import { useProblemsQueryStore } from "@/ui/store/useProblemsQueryStore"

export type LibraryActionMode = "selection" | "view" 

function useLibraryListVM(problems: Problem[], learningRecords: LearningRecord, queryState: QueryState) {
    const libraryItems = useMemo(() =>
        applyQuery(problems, learningRecords, queryState),
        [problems, learningRecords, queryState]
    )
    const ids = useMemo(() => libraryItems.map(p => p.id), [libraryItems])    
    return { libraryItems, ids}
}
function useLibraryDialogsVM(checkedIds: ProblemId[], reload: () => Promise<void>){
    //const startSession = useSessionStore(s=>s.start)
    const navigate = useNavigate()
    // -----------------------------
    // ダイアログ
    // -----------------------------
    
    //const viewerDialog = useViewerDialog()
    //const backupRestoreDialog = useBackupRestoreDialog()
    const tagEditDialog = useMultipleProblemsEditDialog()

    return {
        //viewer: viewerDialog,
        //detail: detailDialog,
        //backupRestore: backupRestoreDialog,
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
    //const problems = useProblemStore(s => s.activeProblems)
    const problems = useProblemStore(selectActiveProblems)
    const reload = useProblemStore(s => s.reload)
    const deleteProblems = useProblemStore(s => s.deleteProblems)

    return { problems, reload, deleteProblems }
}
/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()

    const learningRecords = useLearningRecordStore(s => s.records)
    const [actionMode, setActionMode] = useState<LibraryActionMode>("view")
    const toast = useToast()

    const { problems, reload, deleteProblems } = useLibraryCommands()
    const { libraryItems, ids } = useLibraryListVM(problems, learningRecords, query.state)
    
    const selection = useLibrarySelectionVM(ids)
    const dialogs = useLibraryDialogsVM(selection.checkedIds, reload)
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
                //dialogs.detail.openDialog(p.id)    
                navigate(routes.detail(p.id))
                //navigate(routes.player(p.id))
        }
        
    }, [actionMode, selection.toggleChecked])
    
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
