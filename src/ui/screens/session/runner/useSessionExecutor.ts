import type { SessionId } from "@/domain/session/entity/Session"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { resolveSessionCommand, type SessionCommand, type SessionCommandContext, type SessionEffect } from "@/application/session/resolveSessionCommand"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"
import { useNavigate } from "react-router-dom"
import { runSessionEffects } from "@/ui/screens/session/runner/runSessionEffects"
import { createGameEventBaseScope } from "@/domain/game/decideGameEvent"
import { useReviewEventCommitter } from "@/ui/features/learning/hooks/useReviewEventCommitter"

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
        //playerContext: createPlayerContext(),
        gameEventBaseScope: createGameEventBaseScope(),
    }
}

export function useSessionExecutor(sessionId: SessionId, currentIndex: number) {    
    // run effect deps
    const navigate = useNavigate()
    const { appendReview } = useReviewEventCommitter()
    //console.log("session exec: curentindex", currentIndex)
            
    
    const execute = (cmd: SessionCommand) => {        
        //alert(currentIndex)
        const ctx = createSessionCommandContextFromStores(currentIndex)
        //console.log("exec: curentindex ctx", currentIndex, ctx.currentIndex)
    
        const effects = resolveSessionCommand(cmd, ctx, sessionId)
        //console.log("dispatch", effects, cmd)
        runSessionEffects(effects, { navigate, appendReview })
    }

    return execute
}

