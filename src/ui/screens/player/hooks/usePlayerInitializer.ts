import type { Problem } from "@/domain/problem/entity/Problem"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useEffect, useState } from "react"


export function usePlayerInitializer(problem: Problem){
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeGame = useGameStore(s=>s.initialize)
    const initializeReplay = useReplayStore(s=>s.initialize)
    const restart = useTimerStore(s=>s.restart)
    
    useEffect(()=>{                
        setIsInitialized(false)
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)      
        initializeReplay(problem.kifData.moves.length)
        restart()        
        setIsInitialized(true)
    }, [problem.id])

    return { isInitialized }
}
