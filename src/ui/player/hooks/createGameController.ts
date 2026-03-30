import { evaluateMove, type EvaluationResult } from "@/domain/game/evaluateMove"
import { resolveIntent, type Intent, type IntentResult } from "@/domain/game/intentResolver"
import { type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import type { Problem } from "@/domain/problem/entity/Problem"
import { createPlayerContext, type PlayerContext } from "@/ui/player/components/types/PlayerContext"
import { useGameStore } from "@/ui/player/hooks/useGameStore"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"


export function createGameController() {
    // helpers    

    let turnId = 0

    function advanceTurn() {
        useGameStore.getState().dispatch({type: "ADVANCE_TURN"})
        /*
        const replay = useReplayStore.getState()
        const currentId = ++turnId

        replay.startAnimation()
        replay.advancePly()

        setTimeout(() => {
            if (currentId !== turnId) return

            const replay = useReplayStore.getState()
            replay.advancePly()
            replay.endAnimation()
        }, 500)
        */
    }
    /////////////
    function resolveMoveFromIntent(intent: Intent): IntentResult {
        const game = useGameStore.getState()
        const replay = useReplayStore.getState()        

        switch (intent.type) {
            case "move":
            case "drop": 
                const position = buildUntilPly(
                    game.initialPosition,
                    game.moves,
                    replay.ply
                )                
                return resolveIntent(position, intent)
            case "choosePromotion":
                const move = game.choosePromotion(intent.promote)
                return { type: "move", move: move}       
            default: {
                const _exhaustive: never = intent
                return _exhaustive
            }
            
        }
    }    
    
    function applyResult(res: EvaluationResult, ctx: PlayerContext) {
        const game = useGameStore.getState()
        //const ply = useReplayStore.getState().ply
        const { ply, elapsedSec } = ctx

        switch (res.type) {
            case "incorrect":
                game.dispatch({ type: "MISTAKE", ply, elapsedSec })
                break
            case "correct-ongoing":                
                advanceTurn()
                break            
            case "correct-solved":
                const timer = useTimerStore.getState()                
                timer.stop()
                
                game.dispatch({ type: "SOLVE", ply, elapsedSec })
                break            
        }
    }
    /////////////////////////////////////////////////////
    return {
        start: (problem: Problem) => {
            const game = useGameStore.getState()
            const replay = useReplayStore.getState()
            const timer = useTimerStore.getState()

            game.initialize(problem.kifData.initialPosition, problem.kifData.moves)
            replay.initialize(problem.kifData.moves.length)
            timer.restart()
        },
        handleIntent: (intent: Intent): IntentResult => {
            const game = useGameStore.getState()    
            const res = resolveMoveFromIntent(intent)
            
            if (res.type === "invalidMove") return res
            if (res.type === "promotionPending") {
                game.promotionPending(res.pendingPromotion)
                return res
            }

            // ここは move 確定            
            const ctx = createPlayerContext()
            const result = evaluateMove({move: res.move, moves: game.moves, ply: ctx.ply})
            applyResult(result, ctx)

            return res
        },
        markRevealed: () => {
            const game = useGameStore.getState()
        
            const { ply, elapsedSec } = createPlayerContext()
            game.dispatch({
                type: "REVEAL", ply, elapsedSec
            })
        },

    }

}
