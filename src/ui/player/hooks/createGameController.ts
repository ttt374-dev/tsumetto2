import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"
import { KifData, type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useGameStore } from "@/ui/player/hooks/useGameStore"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"


export function createGameController() {
    // helpers    
    function getCtx() {
        return {
            game: useGameStore.getState(),
            replay: useReplayStore.getState(),
            timer: useTimerStore.getState()
        }
    }
    function advanceTurn() {
        //const replay = useReplayStore.getState()
        const { replay } = getCtx()

        // 入力禁止状態に
        replay.startAnimation()
        replay.advancePly()
        // 自分の手
        
        //replay.moveTo(3)
        //alert(useReplayStore.getState().ply)

        // 相手の手（遅延）
        setTimeout(() => {
            const replay = useReplayStore.getState()
            
            replay.advancePly()
            replay.endAnimation()
        }, 500)
    }
    /////////////
    function resolveMoveFromIntent(intent: Intent): Move | undefined{
        const { game, replay } = getCtx()

        let move: Move | undefined

        switch (intent.type) {
            case "move":
            case "drop": {
                const position = buildUntilPly(
                    game.initialPosition,
                    game.moves,
                    replay.ply
                )

                const result = resolveIntent(position, intent)
                if (!result) return

                switch (result.type) {
                    case "move":
                        move = result.move
                        break;
                    case "promotionPending":
                        game.promotionPending(result.pendingPromotion)
                        return
                }
                break
            }

            case "choosePromotion":
                move = game.choosePromotion(intent.promote)
                break
        }

        //if (!move) throw new Error("no move")
        return move
    }
    function evaluate(move: Move): EvaluationResult {
        const { game, replay } = getCtx()
        return evaluateMove(move, game.moves, replay.ply)
    }
    function applyResult(
        res: EvaluationResult,
        //move: Move,
        elapsedSec: number
    ) {
        const { game, replay } = getCtx()

        switch (res.type) {
            case "correct":                
                advanceTurn()
                break
            case "incorrect":
                game.dispatch({ type: "MISTAKE", ply: replay.ply, elapsedSec })
                break
            case "solved":
                replay.advancePly()
                game.dispatch({ type: "SOLVE", ply: replay.ply, elapsedSec })
                break
        }
    }
    /////////////////////////////////////////////////////
    return {
        start: (problem: Problem) => {
            const { timer, game, replay } = getCtx()
            game.initialize(problem.kifData.initialPosition, problem.kifData.moves)
            replay.initialize(problem.kifData.moves.length)
            timer.restart()
        },
        handleIntent: (intent: Intent, elapsedSec: number) => {
            const move = resolveMoveFromIntent(intent)
            if (!move) return false
            
            const res = evaluate(move)
            applyResult(res, elapsedSec)
            return true
        },
        
        markRevealed: (elapsedSec: number) => {
            const { game, replay } = getCtx()
            game.dispatch({
                type: "REVEAL", ply: replay.ply, elapsedSec
            })
        },
        markAbandon: (elapsedSec: number) => {
            const { game, replay } = getCtx()
            game.dispatch({
                type: "ABANDON", ply: replay.ply, elapsedSec
            })
        }
        // helpers


    }

}
