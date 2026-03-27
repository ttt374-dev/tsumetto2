import { resolveIntent, type Intent } from "@/domain/game/intentResolver"
import type { Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { useGameStore, type GameContext } from "@/ui/player/hooks/useGameStore"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"

export function useGameController() {
    const {
        initialPosition, moves, 
        dispatch, promotionPending, choosePromotion
    } = useGameStore()

    const { ply, advancePly, applyOpponentMove,} = useReplayStore()
    
    const handleIntent = (intent: Intent, elapsedSec: number) => {
        let move: Move | undefined

        switch (intent.type) {
            case "move":
            case "drop": {
                const position = buildUntilPly(initialPosition, moves, ply)
                const result = resolveIntent(position, intent)
                if (!result) return false

                switch (result.type) {
                    case "move":
                        move = result.move
                        break;
                    case "promotionPending":
                        promotionPending(result.pendingPromotion)
                        return false
                }
                break
            }

            case "choosePromotion":
                move = choosePromotion(intent.promote)
                break
        }

        if (!move) throw new Error("no move")

        const res = evaluateMove(move, moves, ply)

        switch (res) {
            case "correct":
                advancePly()
                applyOpponentMove()
                break
            case "incorrect":
                dispatch({ type: "MISTAKE", ply, elapsedSec })
                break
            case "solved":
                dispatch({ type: "SOLVE", ply, elapsedSec })
                break
        }

        return true
    }
    const markRevealed = (ctx: GameContext) => {
        dispatch({
            type: "REVEAL", ply: ctx.ply, elapsedSec: ctx.elapsedSec
        })
    }
    const markAbandon = (ctx: GameContext) => {
        dispatch({
                type: "ABANDON", ply: ctx.ply, elapsedSec: ctx.elapsedSec
            })
    }
    return { handleIntent, markRevealed, markAbandon }

}

//////////////
// pure helpers
function evaluateMove(move: Move, moves: Move[], ply: number) {
    if (!move.equals(moves[ply])) return "incorrect"
    if (ply + 1 >= moves.length) return "solved"
    return "correct"
}
