import type { Problem } from "@/domain/problem/entity/Problem"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useEffect, useState } from "react"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"

export function useGameInitializer(problem: Problem) {
    const [isInitialized, setIsInitialized] = useState(false)
    // 初期化処理
    const initializeGame = useGameStore(s => s.initialize)
    const initializeReplay = useReplayStore(s => s.initialize)
    const clearSelection = useBoardInputStore(s => s.clear)
    const restartTimer = useTimerStore(s => s.restart)

    useEffect(() => {
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)
        initializeReplay(problem.kifData.moves.length)
        clearSelection()
        restartTimer()
        setIsInitialized(true)
        console.log("initialize")
    }, [problem.id])

    return isInitialized
}
