import type { Problem } from "@/domain/problem/entity/Problem"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"
import { useGameStore } from "@/ui/player/store/useGameStore"
import { useReplayStore } from "@/ui/player/store/useReplayStore"
import { useTimerStore } from "@/ui/player/store/useTimerStore"
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
