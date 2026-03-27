import { evaluateMove } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"
import type { Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { useCurrentPosition, useGameStore, type GameContext } from "@/ui/player/hooks/useGameStore"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"

export function createGameController() {   
    const handleIntent = (intent: Intent, elapsedSec: number) => {
        const game = useGameStore.getState()
        const replay = useReplayStore.getState()

        let move: Move | undefined

        switch (intent.type) {
            case "move":
            case "drop": {
                //const position = buildUntilPly(initialPosition, moves, ply)
                const position = buildUntilPly(
                    game.initialPosition,
                    game.moves,
                    replay.ply
                )

                const result = resolveIntent(position, intent)
                if (!result) return false

                switch (result.type) {
                    case "move":
                        move = result.move
                        break;
                    case "promotionPending":
                        game.promotionPending(result.pendingPromotion)
                        return false
                }
                break
            }

            case "choosePromotion":
                move = game.choosePromotion(intent.promote)
                break
        }

        if (!move) throw new Error("no move")

        const res = evaluateMove(move, game.moves, replay.ply)

        switch (res) {
            case "correct":
                replay.advanceTurn()
                break
            case "incorrect":
                game.dispatch({ type: "MISTAKE", ply: replay.ply, elapsedSec })
                break
            case "solved":
                game.dispatch({ type: "SOLVE", ply: replay.ply, elapsedSec })
                break
        }

        return true
    }
    const markRevealed = (elapsedSec: number) => {
        const game = useGameStore.getState()
        const replay = useReplayStore.getState()
        game.dispatch({
            type: "REVEAL", ply: replay.ply, elapsedSec
        })
    }
    const markAbandon = (elapsedSec: number) => {
        const game = useGameStore.getState()
        const replay = useReplayStore.getState()        
        game.dispatch({
            type: "ABANDON", ply: replay.ply, elapsedSec
        })
    }
    return { handleIntent, markRevealed, markAbandon }

}
