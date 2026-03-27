import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"
import { KifData, type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useGameStore, type PendingPromotion } from "@/ui/player/hooks/useGameStore"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"

type ResolveResult =
  | { type: "move"; move: Move }
  | { type: "promotionPending"; pendingPromotion: PendingPromotion }
  | { type: "none"}

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
        const replay = useReplayStore.getState()

        // 入力禁止状態に
        replay.startAnimation()
        // 自分の手
        replay.advancePly()


        // 相手の手（遅延）
        setTimeout(() => {
            const replay = useReplayStore.getState()
            
            replay.advancePly()
            replay.endAnimation()
        }, 500)
    }
    /////////////
    function resolveMoveFromIntent(intent: Intent): ResolveResult {
        const { game, replay } = getCtx()

        //let move: Move | undefined

        switch (intent.type) {
            case "move":
            case "drop": 
                const position = buildUntilPly(
                    game.initialPosition,
                    game.moves,
                    replay.ply
                )

                const result = resolveIntent(position, intent)
                if (!result) return { type: "none"}

                switch (result.type) {
                    case "move":                        
                        return { type: "move", move: result.move}
                        
                    case "promotionPending":
                        //game.promotionPending(result.pendingPromotion)
                        return { type: "promotionPending", pendingPromotion: result.pendingPromotion}
                    default:
                        return { type: "none"}
                }            

            case "choosePromotion":
                const move = game.choosePromotion(intent.promote)
                return { type: "move", move: move}                
        }
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
            case "solved": {
                const replay = useReplayStore.getState()
                const timer = useTimerStore.getState()
                replay.advancePly()
                timer.stop()

                const { ply } = useReplayStore.getState()

                game.dispatch({ type: "SOLVE", ply, elapsedSec })
                break
            }
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
            const { game } = getCtx()
            const resolvedResult = resolveMoveFromIntent(intent)
            switch(resolvedResult.type){
                case "move":
                    const res = evaluate(resolvedResult.move)
                    applyResult(res, elapsedSec)
                    return true
                case "promotionPending":
                    game.promotionPending(resolvedResult.pendingPromotion)
                    return false
                default:
                    return false
            }
        },
        
        markRevealed: (elapsedSec: number) => {
            const { game } = getCtx()
            const { ply } = useReplayStore.getState()
            game.dispatch({
                type: "REVEAL", ply, elapsedSec
            })
        },
        markAbandon: (elapsedSec: number) => {
            const { game } = getCtx()
            const { ply } = useReplayStore.getState()
            game.dispatch({
                type: "ABANDON", ply, elapsedSec
            })
        }
        // helpers


    }

}
