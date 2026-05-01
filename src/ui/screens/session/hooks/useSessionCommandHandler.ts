import { useMemo } from "react"
import { v4 } from "uuid"

import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import type { SessionId } from "@/domain/session/entity/Session"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import type { ProblemId } from "@/domain/problem/entity/Problem"

type SessionCommand =
    | { type: "SUBMIT_REVIEW", problemId: ProblemId }
    | { type: "FLUSH", problemId: ProblemId }
    | { type: "GOTO", index: number}
    | { type: "GO_NEXT", currentIndex: number }
    //| { type: "SKIP", currentIndex: number }
    

export function useSessionCommandHandler(sessionId: SessionId) {
    const navigate = useNavigate()
    const { events, dispatch, state: gameState } = useGameStore()
    const appendReview = useReviewEventStore(s => s.appendReview)
    const reviewedEvents = useReviewEventStore(s => s.eventLog)
    //const next = useSessionStore(s => s.next)    
    //const pid = useSessionStore(s=>s.problemIds[s.currentIndex])    

    /*
    const hasSubmitted = useMemo(() => 
        reviewedEvents.some(
            e => e.type === "reviewed"
                && e.problemId === pid
                && e.sessionId === sessionId
        ),
        [sessionId, reviewedEvents]
    )*/
    const hasSubmitted = (pid: ProblemId) => 
        reviewedEvents.some(
            e => e.type === "reviewed"
                && e.problemId === pid
                && e.sessionId === sessionId
        )
        
    const execute = (cmd: SessionCommand) => {
        switch (cmd.type) {
            case "SUBMIT_REVIEW": {
                if (hasSubmitted(cmd.problemId)) return
                const result = deriveSolvedResultFromEvents(events)
                appendReview(cmd.problemId, v4(), sessionId, result)
                break
            }
            case "GOTO": {
                const { problemIds } = useSessionStore.getState()
                if (cmd.index >= problemIds.length) {
                    navigate(routes.sessionSummary(sessionId))
                    return
                }

                if (cmd.index < 0) return
                navigate(routes.sessionPlay(sessionId, cmd.index))
                break
            }

            case "GO_NEXT": {
                //execute({ type: "FLUSH", currentIndex: cmd.currentIndex})
                //next()
                execute({type: "GOTO", index: cmd.currentIndex+1})
                break
            }
            
            case "FLUSH": {
                if (hasSubmitted(cmd.problemId)) return

                if (!gameState.isSolved && 
                    (gameState.isRevealed || gameState.mistakes > 0)) {
                    const abandonEvent = createAbandonEvent()
                    const nextEvents = dispatch(abandonEvent)
                    const result = deriveSolvedResultFromEvents(nextEvents)
                    appendReview(cmd.problemId, v4(), sessionId, result)
                }
                break
            }
        }
    }

    return { execute }
}

const createAbandonEvent = (): GameEvent => {
    const { ply, elapsedSec } = createPlayerContext()
    return { type: "ABANDON", ply, elapsedSec }
}      