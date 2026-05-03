import { useEffect, useState } from "react"

import { useReplayController } from "@/ui/screens/player/hooks/useReplayController"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type GameUIEvent = 
    | { type: "solved", solvedResult: SolvedResult}
    | { type: "mistake", count: number }
    | { type: "solvedConfirmed"}

export function useGameEventHandler(onUIEvent?: (event: GameUIEvent) => void, enabled: boolean = true ){
    const events = useGameStore(s=>s.events)    
    const gameState = useGameStore(s=>s.state)
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)
    const replayCtrl = useReplayController()    

    // イベント処理
    useEffect(() => {
        //if (!isInitialized) return   // 初期化前は無視
        if (!enabled) return
        const last = events.at(-1)
        if (!last) return

        console.log("event handler", last, events)

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
            case "RETREAT_PLY":
                replay.retreatPly()
                break;
            case "ADVANCE_OPPONENT_PLY":
                replayCtrl.advanceOpponentPly()
                break
            case "ADVANCE_TURN":
                replayCtrl.advanceTurn()
                break;
        }
    }, [events])    
}
