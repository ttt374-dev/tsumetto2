import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent, type IntentResult } from "@/domain/game/intentResolver"
import { Position, type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { createPlayerContext, type PlayerContext } from "@/ui/player/components/types/PlayerContext"
import { type GameEvent, type PendingPromotion } from "@/ui/player/hooks/useGameStore"

type GameWritePort = {
    dispatch: (event: GameEvent) => void
}

type GameQuery = {
    initialPosition: Position,
    moves: Move[]
}

type PromotionPort = {
    choosePromotion: (promote: boolean) => Move
    promotionPending: (pendingPromotion: PendingPromotion) => void
}
type ReplayQuery = {
    ply: number
}

////////////////////////////////////////////
type HandleIntentResult =
  | { type: "invalidMove", reason?: string }
  | { type: "promotionPending"; pendingPromotion: PendingPromotion }
  | { type: "event"; event: GameEvent }

export function handleIntent(intent: Intent,
    gameQuery: GameQuery, promotion: PromotionPort, ply: number
): HandleIntentResult {
    //const game = useGameStore.getState()    
    //const replay = useReplayStore.getState()
    const res = resolveMoveFromIntent(intent, gameQuery, promotion, ply)

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
    const result = evaluateMove({ move: res.move, moves: gameQuery.moves, ply })
    //applyResult(result, ctx)
    const ctx = createPlayerContext()
    const event = deriveAction(result, ctx)
    //applyAction(gameWriter, event)

    return { type: "event", event}
}


function resolveMoveFromIntent(intent: Intent, gameQuery: GameQuery, promotion: PromotionPort, ply: number): IntentResult {
    //const game = useGameStore.getState()
    //const replay = useReplayStore.getState()
    //const ctx = createPlayerContext()

    switch (intent.type) {
        case "move":
        case "drop":
            const position = buildUntilPly(
                gameQuery.initialPosition,
                gameQuery.moves,
                ply)
            return resolveIntent(position, intent)
        case "choosePromotion":
            return { type: "move", move: promotion.choosePromotion(intent.promote) }
        default: {
            const _exhaustive: never = intent
            return _exhaustive
        }
    }
}
function deriveAction(res: EvaluationResult, ctx: PlayerContext): GameEvent {
    switch (res.type) {
        case "incorrect":
            return { type: "MISTAKE", ...ctx }
        case "progress":
            return { type: "ADVANCE_TURN" }
        case "solved":
            return { type: "SOLVE", ...ctx }
        default: {
            const _exhaustive: never = res
            return _exhaustive
        }
    }
}

/////////////////////////////////////////////////////

