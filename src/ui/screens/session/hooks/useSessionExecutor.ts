import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEventId } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useSessionCommandHandler, type SessionCommand, type SessionCommandContext, type SessionCommandEffect } from "@/ui/screens/session/hooks/useSessionCommandHandler"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

export function useSessionExecutor(sessionId: SessionId, currentIndex: number) {
    // store 
    const problemIds = useSessionStore(s => s.problemIds)
    const gameState = useGameStore(s => s.state)
    const events = useGameStore(s => s.events)
    const reviewedEvents = useReviewEventStore(s => s.eventLog)
    const { resolveSessionCommand } = useSessionCommandHandler(sessionId)

    // run effect deps
    const navigate = useNavigate()
    const appendReview = useReviewEventStore(s => s.appendReview)    

    // create context
    const playerContext = createPlayerContext()
    const ctx: SessionCommandContext = useMemo(() => ({
        problemIds,
        currentIndex,
        gameState,
        events,
        reviewedEvents,
        playerContext
    }), [sessionId, problemIds, currentIndex, gameState, events, reviewedEvents, playerContext])

    const execute = useCallback((cmd: SessionCommand) => {
        const effects = resolveSessionCommand(cmd, ctx)
        runEffects(effects, { navigate, appendReview })
    }, [ctx, navigate, appendReview, resolveSessionCommand])

    return execute
}


function runEffects(
    effects: SessionCommandEffect[],
    deps: {
        navigate: ReturnType<typeof useNavigate>
        appendReview: (problemId: ProblemId, reviewId: ReviewEventId, sessionId: SessionId, quality: SolvedResult) => void
    }
) {
    for (const effect of effects) {
        switch (effect.type) {
            case "NAVIGATE":
                deps.navigate(effect.to)
                break
            case "SUBMIT_REVIEW":
                deps.appendReview(effect.problemId, v4(), effect.sessionId, effect.solvedResult)
                break;
            default:
                const _exhaustive: never = effect
                return _exhaustive            
        }
    }

}

