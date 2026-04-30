import { useMemo } from "react"
import { v4 } from "uuid"

import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import type { SessionId } from "@/domain/session/entity/Session"

type SessionCommand =
    | { type: "SUBMIT_REVIEW" }
    | { type: "GO_NEXT" }
    | { type: "SKIP" }
    | { type: "FLUSH" }

export function useSessionCommandHandler(sessionId: SessionId) {
    const { events, dispatch, state: gameState } = useGameStore()
    const appendReview = useReviewEventStore(s => s.appendReview)
    const reviewedEvents = useReviewEventStore(s => s.eventLog)
    const next = useSessionStore(s => s.next)    
    const pid = useSessionStore(s=>s.problemIds[s.currentIndex])

    const hasSubmitted = useMemo(() => 
        reviewedEvents.some(
            e => e.type === "reviewed"
                && e.problemId === pid
                && e.sessionId === sessionId
        ),
        [pid, sessionId, reviewedEvents]
    )

    const execute = (cmd: SessionCommand) => {
        switch (cmd.type) {
            case "SUBMIT_REVIEW": {
                if (hasSubmitted) return
                const result = deriveSolvedResultFromEvents(events)
                appendReview(pid, v4(), sessionId, result)
                break
            }

            case "GO_NEXT": {
                execute({ type: "FLUSH" })
                next()
                break
            }

            case "SKIP": {
                next()
                break
            }

            case "FLUSH": {
                if (hasSubmitted) return

                if (!gameState.isSolved && 
                    (gameState.isRevealed || gameState.mistakes > 0)) {
                    const abandonEvent = createAbandonEvent()
                    const nextEvents = dispatch(abandonEvent)
                    const result = deriveSolvedResultFromEvents(nextEvents)
                    appendReview(pid, v4(), sessionId, result)
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