import { type IntentResult } from "@/domain/game/intentResolver"
import { Move, Position } from "@/domain/kif/entity"
import { type GameEvent, type PendingPromotion } from "@/ui/player/hooks/useGameStore"

type GameQuery = {
    initialPosition: Position,
    moves: Move[]
}

type PromotionPort = {
    choosePromotion: (promote: boolean) => Move
    promotionPending: (pendingPromotion: PendingPromotion) => void
}
////////////////////////////////////////////
type HandleIntentResult =
  | { type: "invalidMove", reason?: string }
  | { type: "promotionPending"; pendingPromotion: PendingPromotion }
  | { type: "event"; event: GameEvent }

//////////////////////////////////

export function decideGameEvent(res: IntentResult, nextMmove: Move, isLastMove: boolean,
     ply: number, elapsedSec: number
): HandleIntentResult {    
    //const res = resolveMoveFromIntent(intent, position, promotion, ply)
    //console.log("resolvedmove", intent, res)

    if (res.type === "invalidMove") return { 
        type: "invalidMove",
        reason: res.reason
    }
    if (res.type === "promotionPending") {
        return { 
            type: "promotionPending",
            pendingPromotion: res.pendingPromotion
        }
    }    
    //console.log("handle res", res, remainingMoves)
    const event = deriveGameEvent(res.move, nextMmove, isLastMove, ply, elapsedSec)
    return { type: "event", event}
}

function deriveGameEvent(move: Move, nextMove: Move, isLastMove: boolean, ply: number, elapsedSec: number): GameEvent {
    if (!move.equals(nextMove)){
        return { type: "MISTAKE", ply, elapsedSec}
    }
    //if (remainingMoves.length <= 1){
    if (isLastMove){
        return { type: "SOLVE", ply, elapsedSec}
    } else {
        return { type: "ADVANCE_TURN"}
    }
}

/////////////////////////////////////////////////////

