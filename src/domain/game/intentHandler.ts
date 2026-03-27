import { resolveIntent, type Intent } from "@/domain/game/intentResolver";
import { Move } from "@/domain/kif/entity";
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly";
import { useGameStore, type TryMoveResult } from "@/ui/player/hooks/useGameStore";

export function handleIntent(intent: Intent, elapsedSec: number) {
    console.log("handle intent", intent, elapsedSec)

    const { initialPosition, moves, ply, 
        tryMove, promotionPending, choosePromotion } = useGameStore()

    let trymoveResult: TryMoveResult | undefined = undefined

    switch (intent.type) {
        case "move":
        case "drop":
            const position = buildUntilPly(initialPosition, moves, ply)
            const result = resolveIntent(position, intent)

            if (!result) return false
            switch (result.type) {
                case "move":
                    trymoveResult = tryMove(result.move, elapsedSec)
                    break;
                case "promotionPending":
                    promotionPending(result.pendingPromotion)
                    //set({ pendingPromotion: result.pendingPromotion })
                    break;
            }
            //return true
            break;
        case "choosePromotion":
            const move = choosePromotion(intent.promote)
            trymoveResult = tryMove(move, elapsedSec)
            break;
        //return true
    }

    return true
}