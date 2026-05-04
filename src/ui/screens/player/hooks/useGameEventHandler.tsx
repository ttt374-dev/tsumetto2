import { useEffect } from "react"

import { useReplayController } from "@/ui/screens/player/hooks/useReplayController"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore, type ReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"

export type GameFeedback = 
    | { type: "solved", solvedResult: SolvedResult}
    | { type: "mistake", count: number }
    | { type: "solvedConfirmed"}

export function useGameEventHandler(onUIEvent?: (f: GameFeedback) => void, enabled: boolean = true ){
    const events = useGameStore(s=>s.events)    
    const mistakes = useGameStore(s=>s.state.mistakes)
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)
    const replayCtrl = useReplayController()    

    // イベント処理
    useEffect(() => {
        if (!enabled) return
        const last = events.at(-1)
        if (!last) return

        console.log("event handler", last, events)

        handleGameEvent(last, {
            replay, replayCtrl, stopTimer, events, onUIEvent,
            mistakes
        })
    }, [events])    
}
function handleGameEvent(e: GameEvent, ctx: {
    replay: ReplayStore
    replayCtrl: ReturnType<typeof useReplayController>
    stopTimer: () => void
    events: GameEvent[]
    mistakes: number
    onUIEvent?: (f: GameFeedback) => void

}) {
    const { replay, replayCtrl, stopTimer, events, mistakes, onUIEvent } = ctx

    switch (e.type) {
        case "SOLVE":
            replay.advancePly()
            stopTimer()
            //onSolve?.()
            const solvedResult = deriveSolvedResultFromEvents(events)
            onUIEvent?.({ type: "solved", solvedResult: solvedResult })
            break;
        case "MISTAKE":
            onUIEvent?.({ type: "mistake", count: mistakes })
            break;
        case "ADVANCE_PLY":
            replay.advancePly()
            break;
        case "RETREAT_PLY":
            replay.retreatPly()
            break;
        case "MOVETO_PLY":
            replay.moveTo(e.to)
            break
        case "ADVANCE_OPPONENT_PLY":
            replayCtrl.advanceOpponentPly()
            break
        case "ADVANCE_TURN":
            replayCtrl.advanceTurn()
            break;
    }

}