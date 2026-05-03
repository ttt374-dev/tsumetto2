import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEventId } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { resolveSessionCommand, type SessionCommand, type SessionCommandContext, type SessionCommandEffect } from "@/ui/screens/session/vm/resolveSessionCommand"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"

export function createSessionCommandContextFromStores(  // スナップショット    
    currentIndex: number
): SessionCommandContext {
    // NOTE: getState()で最新状態を取得してコマンドを解決する
    const sessionStore = useSessionStore.getState()
    const gameStore = useGameStore.getState()
    const reviewStore = useReviewEventStore.getState()

    return {
        problemIds: sessionStore.problemIds,
        currentIndex,
        gameState: gameStore.state,
        events: gameStore.events,
        reviewedEvents: reviewStore.eventLog,
        playerContext: createPlayerContext(),
    }
}

export function useSessionExecutor(sessionId: SessionId, currentIndex: number) {    
    // run effect deps
    const navigate = useNavigate()
    const appendReview = useReviewEventStore(s => s.appendReview)

    // create context    
    const dispatch = useCallback((cmd: SessionCommand) => {
        const ctx = createSessionCommandContextFromStores(currentIndex)
        const effects = resolveSessionCommand(cmd, ctx, sessionId)
        //console.log("dispatch", effects, cmd)
        runEffects(effects, { navigate, appendReview })
    }, [navigate, appendReview, currentIndex, sessionId])

    return dispatch
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
            case "APPEND_REVIEW":
                deps.appendReview(effect.problemId, effect.reviewId, effect.sessionId, effect.solvedResult)
                break;
            default:
                const _exhaustive: never = effect
                throw new Error("Unknown effect")        
        }
    }

}

