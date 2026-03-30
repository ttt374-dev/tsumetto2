import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent, type IntentResult } from "@/domain/game/intentResolver"
import { Position, type Move } from "@/domain/kif/entity"
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

export function handleIntent(intent: Intent,
    position: Position, nextMove: Move, promotion: PromotionPort, ply: number
): HandleIntentResult {
    //const game = useGameStore.getState()    
    //const replay = useReplayStore.getState()
    const res = resolveMoveFromIntent(intent, position, promotion, ply)

    if (res.type === "invalidMove") return { 
        type: "invalidMove",
        reason: res.reason
    }
    if (res.type === "promotionPending") {
        //promotion.promotionPending(res.pendingPromotion)
        return { 
            type: "promotionPending",
            pendingPromotion: res.pendingPromotion
        }
    }

    // ここは move 確定            
    //const result = evaluateMove({ move: res.move, moves: gameQuery.moves, ply })
    //applyResult(result, ctx)
    const ctx = createPlayerContext()
    //const event = deriveAction(result, ctx)
    //applyAction(gameWriter, event)

    //const nextMove = gameQuery.moves[ply]
    
    const event: GameEvent = res.move.equals(nextMove) 
        ? { type: "ADVANCE_PLY"} 
        : { type: "MISTAKE", ply, elapsedSec: ctx.elapsedSec}
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

/////////////////////////////////////////////////////

