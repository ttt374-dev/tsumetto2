import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { routes } from "@/ui/App/useAppNavigation"
import { useProblemMutation } from "@/ui/features/problem/hooks/useProblemMutation"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore"
import { useNavigate } from "react-router-dom"

export type LibraryActions = {
    session: {
        start: (sessoinId: SessionId, idx: ProblemId[]) => void
    }
    problem: {
        delete: (ids: ProblemId[]) => void
    }
    navigation: {
        detail: (id: ProblemId) => void
    }

}

export function useLibraryActions(ids: ProblemId[]) {
    const startSession = useSessionStore(s=>s.start)    
    const navigate = useNavigate()
    const { deleteProblems } = useProblemMutation()
    
    const runSession = () => {
        const sessionId = createSessionId()
        startSession(sessionId, ids)
        navigate(routes.sessionPlay(sessionId))
    }

    return {
        session: {
            start: runSession
        },
        problem: {
            delete: deleteProblems
        }
    }
}