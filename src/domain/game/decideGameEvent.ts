import { type IntentResult } from "@/domain/game/intentResolver"
import type { GameEvent, GameEventBaseScope, PendingPromotion } from "@/domain/game/types/GameEvent";
import { Move, type Player } from "@/domain/kif/entity"
import { useGameStore,  } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";

type GameDecision =
  | { type: "invalidMove", reason?: string }
  | { type: "promotionPending"; pendingPromotion: PendingPromotion}
  | { type: "event"; event: GameEvent }

//////////////////////////////////
export function decideGameEvent(props: { 
    intentResult: IntentResult, 
    isUserTurn: boolean,
    scope: DecideGameEventScope
 }
): GameDecision {
    //console.log("decide event", props)
    if (props.intentResult.type === "invalidMove") return { 
        type: "invalidMove",
        reason: props.intentResult.reason
    }
    if (props.intentResult.type === "promotionPending") {
        return { 
            type: "promotionPending",
            pendingPromotion: props.intentResult.pendingPromotion
        }
    }    
    const event = deriveGameEvent(props.intentResult.move, props.isUserTurn, props.scope)
    return { type: "event", event}
}

function deriveGameEvent(move: Move, isUserTurn: boolean, scope: DecideGameEventScope): GameEvent {
    //console.log("is userturn", isUserTurn)
    const { nextMove, isLastMove, ...baseScope} = scope
    if (!move.equals(scope.nextMove)){
        return { type: "MISTAKE", ...baseScope}
    }
    if (isLastMove){
        return { type: "SOLVE", ...baseScope}
    } else {
        if (isUserTurn){
            return { type: "ADVANCE_TURN", ...baseScope}
        } else { 
            return { type: "ADVANCE_PLY", ...baseScope}
        }
    }
}

/////////////////////////////////////////////////////
// helpers
export type DecideGameEventScope = GameEventBaseScope & {
    nextMove: Move
    isLastMove: boolean
}
export function createGameEventBaseScope(): GameEventBaseScope {
    const elapsedSec = useTimerStore.getState().elapsedSec
    const ply = useReplayStore.getState().ply
    const sessionId = useGameStore.getState().sessionId
    
    return { elapsedSec, ply, sessionId}
}
export function createDecideGameEventScope(): DecideGameEventScope {
    const moves = useGameStore.getState().moves
    const { ply, elapsedSec, sessionId} = createGameEventBaseScope()

    const nextMove = moves[ply]
    const isLastMove = ply + 1 >= moves.length

    return { nextMove, isLastMove, ply, elapsedSec, sessionId}
}
