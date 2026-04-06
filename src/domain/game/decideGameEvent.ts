import { type IntentResult } from "@/domain/game/intentResolver"
import { Move } from "@/domain/kif/entity"
import { useGameStore, type GameEvent, type PendingPromotion } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore";

type GameDecision =
  | { type: "invalidMove", reason?: string }
  | { type: "promotionPending"; pendingPromotion: PendingPromotion }
  | { type: "event"; event: GameEvent }

//////////////////////////////////
export function decideGameEvent(props: { intentResult: IntentResult, nextMove: Move, isLastMove: boolean,
     ply: number, elapsedSec: number }
): GameDecision {    

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
    //console.log("handle res", res, remainingMoves)
    const event = deriveGameEvent(props.intentResult.move, props.nextMove, props.isLastMove, props.ply, props.elapsedSec)
    return { type: "event", event}
}

function deriveGameEvent(move: Move, nextMove: Move, isLastMove: boolean, ply: number, elapsedSec: number): GameEvent {
    if (!move.equals(nextMove)){
        return { type: "MISTAKE", ply, elapsedSec}
    }
    if (isLastMove){
        return { type: "SOLVE", ply, elapsedSec}
    } else {
        return { type: "ADVANCE_TURN", ply, elapsedSec}
    }
}

/////////////////////////////////////////////////////
// helpers
export function createDecideGameEventContext(){
    const moves = useGameStore.getState().moves
    const ply = useReplayStore.getState().ply
    const elapsedSec = useTimerStore.getState().elapsedSec

    const nextMove = moves[ply]
    const isLastMove = ply + 1 >= moves.length

    return { nextMove, isLastMove, ply, elapsedSec}
}
