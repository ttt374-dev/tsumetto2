import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { type GameEvent, type GameState } from "@/ui/screens/player/store/useGameStore"
import type { SessionId } from "@/domain/session/entity/Session"
import { routes } from "@/ui/App/useAppNavigation"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { ReviewEventLog } from "@/domain/review/ReviewEvent"
import { ConstructionOutlined } from "@mui/icons-material"

export type SessionCommand =    
    | { type: "SUBMIT_REVIEW" }
    | { type: "FLUSH"}
    
    | { type: "OPEN_SESSION_LIST" }
    | { type: "GOTO_PROBLEM", index: number}
    | { type: "ADVANCE_PROBLEM"}

export type SessionEffect = 
    | { type: "NAVIGATE", to: string}
    | { type: "APPEND_REVIEW", problemId: ProblemId, sessionId: SessionId, solvedResult: SolvedResult}

export type SessionCommandContext = {
    problemIds: ProblemId[]
    gameState: GameState
    events: GameEvent[]
    reviewedEvents: ReviewEventLog
    currentIndex: number
    playerContext: {
        ply: number
        elapsedSec: number
    }
}

////////////////////////////////////////////////////////////////////
export function resolveSessionCommand(
    cmd: SessionCommand, ctx: SessionCommandContext, 
    sessionId: SessionId): SessionEffect[] {
    const problemId = ctx.problemIds[ctx.currentIndex]
    console.log("resolve session", cmd, ctx.currentIndex, problemId, ctx)
    if (!problemId) return []

    switch (cmd.type) {
        case "SUBMIT_REVIEW": {
            const s = hasSubmitted(sessionId, problemId, ctx.reviewedEvents)
            console.log("submit review", s, sessionId, problemId, ctx)
            if (hasSubmitted(sessionId, problemId, ctx.reviewedEvents)) return []
            const solvedResult = deriveSolvedResultFromEvents(ctx.events)
            //const reviewId = createReviewId()
            return [{ type: "APPEND_REVIEW", problemId, sessionId, solvedResult }]

        }
        case "GOTO_PROBLEM": {
            if (cmd.index >= ctx.problemIds.length) {
                return [{ type: "NAVIGATE", to: routes.sessionSummary(sessionId) }]
            }
            if (cmd.index < 0) return []
            return [{ type: "NAVIGATE", to: routes.sessionPlay(sessionId, cmd.index) }]
        }

        case "ADVANCE_PROBLEM": {
            const nextIndex = ctx.currentIndex + 1
            return resolveAllSessionCommands([
                { type: "FLUSH"}, 
                { type: "GOTO_PROBLEM", index: nextIndex }], ctx, sessionId)            
        }
        case "OPEN_SESSION_LIST": {
            return [
                { type: "NAVIGATE", to: routes.sessionList(sessionId, ctx.currentIndex) }
            ]
        }

        case "FLUSH": {
            if (hasSubmitted(sessionId, problemId, ctx.reviewedEvents)) return []

            if (shouldFlush(ctx.gameState)) {
                const abandonEvent = createAbandonEvent(ctx)
                const nextEvents = [...ctx.events, abandonEvent]
                const solvedResult = deriveSolvedResultFromEvents(nextEvents)
                //const reviewId = createReviewId()
                return [{ type: "APPEND_REVIEW", problemId, sessionId, solvedResult }]
            }
            return []
        }
    }
}
function resolveAllSessionCommands(commands: SessionCommand[], ctx: SessionCommandContext, sessionId: SessionId): SessionEffect[] {
    return commands.flatMap(cmd => resolveSessionCommand(cmd, ctx, sessionId))
}

// helpers
function createAbandonEvent(ctx: SessionCommandContext): GameEvent {
    const { ply, elapsedSec } = ctx.playerContext
    return { type: "ABANDON", ply, elapsedSec }
}

function hasSubmitted(sessionId: SessionId, pid: ProblemId, reviewedEvents: ReviewEventLog): boolean {
    return reviewedEvents.some(
        e => e.type === "reviewed"
            && e.problemId === pid
            && e.sessionId === sessionId
    )
}
function shouldFlush(gameState: GameState): boolean {    
    return(!gameState.isSolved &&
        (gameState.isRevealed || gameState.mistakes > 0))
}