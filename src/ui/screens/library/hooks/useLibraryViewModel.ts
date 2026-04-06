import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"

import { selectActiveProblems, useProblemStore } from "@/ui/domains/problem/hooks/useProblemStore"
import { useLearningRecordStore } from "@/ui/domains/learning/hooks/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useLibraryCheckbox } from "./useLibraryCheckbox"
import { useMultipleProblemsEditDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog"
import { useProblemsQueryStore } from "@/ui/domains/problem/hooks/useProblemsQueryStore"

export type LibraryActionMode = "selection" | "view" 

function useLibrarySelectionVM(ids: ProblemId[]){
    // -----------------------------
    // 選択管理
    // -----------------------------    
    const checkboxControl = useLibraryCheckbox(ids)
    const selection = useMemo(() => ({
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        
    }), [checkboxControl.checkedIds, checkboxControl.isChecked])

    const actions = useMemo(()=>({
        selectAll: checkboxControl.checkAll,
        clearAll: checkboxControl.uncheckAll,
        toggleChecked: checkboxControl.toggleChecked,        
    }), [checkboxControl.checkAll, checkboxControl.uncheckAll, checkboxControl.toggleChecked])
    return  {...selection, ...actions}
}
/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()

    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    const [actionMode, setActionMode] = useState<LibraryActionMode>("view")
    
    const problems = useProblemStore(selectActiveProblems)
    const ids = applyQuery(problems, learningRecords, query.state).map(p=>p.id)   

    
    const selection = useLibrarySelectionVM(ids)      
    const dialogs = {
        tagEdit: useMultipleProblemsEditDialog()
    }
    // アクションモード
    const changeActionMode = (mode: LibraryActionMode) => {
        setActionMode(mode)
        selection.clearAll()
    }
    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const navigate = useNavigate()
    const onItemClick = useCallback((p: Problem) => {        
        switch(actionMode){
            case "selection":
                selection.toggleChecked(p.id)
                break;
            case "view":
                navigate(routes.detail(p.id))

        }        
    }, [actionMode, selection.toggleChecked])
    
    /////////////////////////////////////////
    return {
        ids,
        query,
        mode: actionMode, changeActionMode,
        selection,        
        onItemClick,
        dialogs
    }
}
