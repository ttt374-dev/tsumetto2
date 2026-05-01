import { useCallback, useEffect, useRef } from "react"

import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { useNavigate, useParams } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useSessionExecutor } from "@/ui/screens/session/hooks/useSessionExecutor"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"

export function useSessionPlayerViewModel(problem: Problem, sessionId: SessionId, currentIndex: number) {
    // --- store ---
    //const problemIds = useSessionStore(s => s.problemIds)
    //const problemId = problemIds[currentIndex]
    //const problem = useProblemStore(s => s.byId[problemId])
    
    // --- title ---
    const title = useSessionPlayerTitleMaker(problem, currentIndex)

    // --- executor ---
    const execute = useSessionExecutor(sessionId, currentIndex)

    // --- navigation ---
    const navigate = useNavigate()

    const goNext = useCallback(() => {
        execute({ type: "GO_NEXT" })
    }, [execute])

    const goList = useCallback(() => {
        navigate(routes.sessionList(sessionId, currentIndex))
    }, [navigate, sessionId, currentIndex])

    // --- UI events ---
    const handleUIEvent = useCallback((uiEvent: GameUIEvent) => {
        switch (uiEvent.type) {
            case "solvedConfirmed":
                execute({ type: "GO_NEXT" })
                break
        }
    }, [execute])

    // --- side effect (SOLVE → SUBMIT) ---
    const executeRef = useRef(execute)
    executeRef.current = execute
    const lastEvent = useGameStore(s => s.events.at(-1))

    useEffect(() => {
        if (lastEvent?.type === "SOLVE") {
            executeRef.current({ type: "SUBMIT_REVIEW" })
        }
    }, [lastEvent])

    //
    return { type: "ready", title, problem, 
        goNext, goList, handleUIEvent,
        sessionId, currentIndex
     } as const
}