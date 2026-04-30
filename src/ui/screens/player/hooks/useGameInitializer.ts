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

export function useGameInitializer(problem: Problem){
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
