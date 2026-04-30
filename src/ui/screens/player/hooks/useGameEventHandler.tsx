import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useReplayController } from "@/ui/screens/player/hooks/useReplayController"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useEffect, useState } from "react"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type GameUIEvent = 
    | { type: "solved", solvedResult: SolvedResult}
    | { type: "mistake", count: number }
    | { type: "solvedConfirmed"}
//    | { type: "navigate", to: string}

function useGameInitializer(problem: Problem){
    // 初期化処理
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeGame = useGameStore(s=>s.initialize)
    const initializeReplay = useReplayStore(s=>s.initialize)
    const clearSelection = useBoardInputStore(s=>s.clear)
    const restartTimer = useTimerStore(s=>s.restart)
    
    useEffect(()=>{                
        initialize()
    }, [problem.id])

    const initialize = () => {
        setIsInitialized(false)
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)
        initializeReplay(problem.kifData.moves.length)
        clearSelection()
        restartTimer()
        setIsInitialized(true)
    }
    return { initialize, isInitialized }

}
export function useGameEventHandler(problem: Problem, onUIEvent?: (event: GameUIEvent) => void){
    const events = useGameStore(s=>s.events)    
    const gameState = useGameStore(s=>s.state)
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)
    const replayCtrl = useReplayController()    

    const { isInitialized } = useGameInitializer(problem)

    // イベント処理
    useEffect(() => {
        if (!isInitialized) return   // 初期化前は無視
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":        
                replay.advancePly()
                stopTimer()
                //onSolve?.()
                const solvedResult = deriveSolvedResultFromEvents(events)
                onUIEvent?.({type: "solved", solvedResult: solvedResult})
                break;        
            case "MISTAKE":
                //toast({message: `mistake: ${gameState.mistakes}`})
                onUIEvent?.({ type: "mistake", count: gameState.mistakes })
                break;
            case "ADVANCE_PLY":
                replay.advancePly()
                break;
            case "ADVANCE_OPPONENT_PLY":
                replayCtrl.advanceOpponentPly()
                break
            case "ADVANCE_TURN":
                replayCtrl.advanceTurn()
                break;
        }
    }, [events])
    
    return { isInitialized }
}
