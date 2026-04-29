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
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"

//export type LibraryActionMode = "selection" | "view" 



/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()

    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    //const [actionMode, setActionMode] = useState<LibraryActionMode>("view")
    
    const problems = useProblemStore(selectActiveProblems)
    const ids = applyQuery(problems, learningRecords, query.state).map(p=>p.id)   
    
    const selection = useLibrarySelection(ids)      
    const dialogs = {
        edit: useMultipleProblemsEditDialog()
    }
    // アクションモード
    /*
    const changeActionMode = (mode: LibraryActionMode) => {
        setActionMode(mode)
        selection.clearAll()
    }*/
    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const navigate = useNavigate()
    const onItemClick = useCallback((id: ProblemId) => {        
        if (selection.isSelecting)        
                selection.toggleChecked(id)
        else 
            navigate(routes.detail(id))
    }, [selection.isSelecting, selection.toggleChecked])

    // ミッション
    //const navigate = useNavigate()    
    

    const startSession = useSessionStore(s => s.start)
    const startMission = () => {
        startSession("library-instant-session", ids)
        navigate(routes.sessionPlay)
    }

    
    /////////////////////////////////////////
    return {
        ids,
        query,
        selection,        
        onItemClick,
        dialogs,
        startMission
    }
}
