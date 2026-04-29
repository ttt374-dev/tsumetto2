import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"

import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useMultipleProblemsEditDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog"
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore"
import { useLibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection"

export type LibraryActionMode = "selection" | "view" 
export type LibrarySelection = ReturnType<typeof useLibrarySelection>


/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()

    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    const [actionMode, setActionMode] = useState<LibraryActionMode>("view")
    
    const problems = useProblemStore(selectActiveProblems)
    const ids = applyQuery(problems, learningRecords, query.state).map(p=>p.id)   
    
    const selection = useLibrarySelection(ids)      
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
