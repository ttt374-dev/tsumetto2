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
import { createSessionId, useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"

/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()
    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    const problems = useProblemStore(selectActiveProblems)
    const deleteProblems = useProblemStore(s=>s.deleteProblems)
    const ids = applyQuery(problems, learningRecords, query.state).map(p=>p.id)       
    const selection = useLibrarySelection(ids)      
    const dialogs = {
        edit: useMultipleProblemsEditDialog()
    }

    // アイテムクリック
    const navigate = useNavigate()
    const onItemClick = useCallback((id: ProblemId) => {        
        if (selection.isSelecting)        
            selection.toggleChecked(id)
        else 
            navigate(routes.detail(id))
    }, [selection.isSelecting, selection.toggleChecked])

    // セッション
    const startSession = useSessionStore(s => s.start)
    const sessionId = createSessionId()
    //const sessionId = useSessionStore(s=>s.sessionId)
    const session = {
        start: () => {
            startSession("library-instant-session", ids)
            navigate(routes.sessionPlay(sessionId, 0))    
        }
    }
    // コマンド
    const commands = {
        delete: (ids: ProblemId[]) => {
            deleteProblems(ids)
        }
    }
    
    /////////////////////////////////////////
    return {
        ids,
        query,
        selection,        
        onItemClick,
        dialogs,
        session,
        commands,
    }
}
