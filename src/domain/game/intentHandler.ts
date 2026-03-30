import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent, type IntentResult } from "@/domain/game/intentResolver"
import { Move, Position } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { createPlayerContext, type PlayerContext } from "@/ui/player/components/types/PlayerContext"
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

export function handleIntentResult(res: IntentResult,
    position: Position, remainingMoves: Move[], promotion: PromotionPort, ply: number, elapsedSec: number
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
    const event = deriveGameEvent(res.move, remainingMoves, ply, elapsedSec)
    return { type: "event", event}
}


function resolveMoveFromIntent(intent: Intent, position: Position, promotion: PromotionPort, ply: number): IntentResult {
    switch (intent.type) {
        case "move":
        case "drop":            
            return resolveIntent(position, intent)
        case "choosePromotion":
            return { type: "move", move: promotion.choosePromotion(intent.promote) }
        default: {
            const _exhaustive: never = intent
            return _exhaustive
        }
    }
}
function deriveGameEvent(move: Move, remainingMoves: Move[], ply: number, elapsedSec: number): GameEvent {
    if (!move.equals(remainingMoves[0])){
        return { type: "MISTAKE", ply, elapsedSec}
    }
    if (remainingMoves.length <= 1){
        return { type: "SOLVE", ply, elapsedSec}
    } else {
        return { type: "ADVANCE_TURN"}
    }
}

/////////////////////////////////////////////////////

