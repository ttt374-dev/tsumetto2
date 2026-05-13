import type { Problem } from "@/domain/problem/entity/Problem"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useEffect, useState } from "react"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore"

export function useGameInitializer(problem: Problem) {
    const [isInitialized, setIsInitialized] = useState(false)
    // 初期化処理
    const initializeGame = useGameStore(s => s.initialize)
    const initializeGameUI = useGameUIStore(s=>s.initialize)
    const initializeReplay = useReplayStore(s => s.initialize)
    const clearSelection = useBoardInputStore(s => s.clear)
    const restartTimer = useTimerStore(s => s.restart)
    const setUserSide = useGameUIStore(s=>s.setUserSide)
    const setReversed = useGameUIStore(s=>s.setReversed)

    useEffect(() => {
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)
        initializeGameUI()
        initializeReplay(problem.kifData.moves.length)
        clearSelection()
        restartTimer()
        setIsInitialized(true)
        if (problem.userSide === "white"){
            setUserSide("white")
            setReversed(true)
        }

        //console.log("initialize")
    }, [problem.id])

    return isInitialized
}
