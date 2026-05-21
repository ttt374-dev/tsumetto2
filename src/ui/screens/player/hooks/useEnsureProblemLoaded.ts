import { useCallback } from "react"

import type { Problem } from "@/domain/problem/entity/Problem"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore"

export function useEnsureProblemLoaded(problem: Problem) {
    // 初期化処理
    const loadedProblemId = useGameStore(s => s.loadedProblemId)
    const loadProblem = useGameStore(s => s.loadProblem)
    const initializeGameUI = useGameUIStore(s => s.initialize)
    const initializeReplay = useReplayStore(s => s.initialize)
    const clearSelection = useBoardInputStore(s => s.clear)
    const restartTimer = useTimerStore(s => s.restart)
    const setUserSide = useGameUIStore(s => s.setUserSide)
    const setReversed = useGameUIStore(s => s.setReversed)
    //acconst isReversed = useGameUIStore(s=>s.isReversed)

    return useCallback(() => {
        if (loadedProblemId === problem.id) return
        loadProblem(problem)
        initializeGameUI()
        initializeReplay(problem.kifData.moves.length)
        clearSelection()
        restartTimer()
        setUserSide(problem.userSide)
        setReversed(problem.userSide === "white")
        //console.log("reversed", isReversed, problem.userSide)
    }
        , [loadedProblemId,
            problem,
            loadProblem,
            initializeGameUI,   
            initializeReplay,
            clearSelection,
            restartTimer,
            setUserSide,
            setReversed])
}
