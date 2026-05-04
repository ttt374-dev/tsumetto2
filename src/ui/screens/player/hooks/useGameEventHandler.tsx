import { useEffect } from "react"

import { useReplayController, type ReplayController } from "@/ui/screens/player/hooks/useReplayController"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore, type ReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { GameUIEvent } from "@/ui/screens/player/components/types/GameUIEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"

type GameAction = 
  | { type: "REPLAY_PLY", direction: "FORWARD" | "BACKWARD"}
  | { type: "REPLAY_MOVE_TO"; to: number }
  | { type: "REPLAY_ADVANCE_OPPONENT" }
  | { type: "REPLAY_ADVANCE_TURN" }
  | { type: "STOP_TIMER" }

  | { type: "GAME_SOLVED", solvedResult: SolvedResult}
  | { type: "GAME_MISTAKE", count: number}


export function useGameEventHandler(onUIEvent?: (f: GameUIEvent) => void, enabled: boolean = true ){
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

        //console.log("event handler", last, events)
        const actions = interpretGameEvent(last, {
            events,
            mistakes,
        })

        executeGameActions(actions, {
            replay,
            replayCtrl,
            stopTimer,
            //onUIEvent,
        })
        // ② UI変換（副作用なし）
        emitUIEvents(actions, onUIEvent)
    }, [events])    
}
function interpretGameEvent(e: GameEvent, 
      ctx: { events: GameEvent[]; mistakes: number }
): GameAction[]{
    switch (e.type) {
        case "SOLVE":
            return [
                { type: "REPLAY_PLY", direction: "FORWARD" },
                { type: "STOP_TIMER" },
                { type: "GAME_SOLVED", solvedResult: deriveSolvedResultFromEvents(ctx.events)},
            ]
        case "MISTAKE":
            return [{ type: "GAME_MISTAKE", count: ctx.mistakes,}]
        case "ADVANCE_PLY":
            return [{ type: "REPLAY_PLY", direction: "FORWARD" }]
        case "RETREAT_PLY":
            return [{ type: "REPLAY_PLY", direction: "BACKWARD" }]
        case "MOVETO_PLY":
            return [{ type: "REPLAY_MOVE_TO", to: e.to }]
        case "ADVANCE_OPPONENT_PLY":
            return [{ type: "REPLAY_ADVANCE_OPPONENT" }]
        case "ADVANCE_TURN":
            return [{ type: "REPLAY_ADVANCE_TURN" }]
        default:
            return []    
    }
}

function executeGameActions(
  actions: GameAction[],
  ctx: {
    replay: ReplayStore
    replayCtrl: ReplayController
    stopTimer: () => void
    //onUIEvent?: (f: GameUIEvent) => void
  }
) {
  for (const action of actions) {
    switch (action.type) {
      case "REPLAY_PLY":
        if (action.direction === "FORWARD") ctx.replay.advancePly()
        else ctx.replay.retreatPly()
        break

      case "REPLAY_MOVE_TO":
        ctx.replay.moveTo(action.to)
        break

      case "REPLAY_ADVANCE_OPPONENT":
        ctx.replayCtrl.advanceOpponentPly()
        break

      case "REPLAY_ADVANCE_TURN":
        ctx.replayCtrl.advanceTurn()
        break

      case "STOP_TIMER":
        ctx.stopTimer()
        break

      //case "EMIT_UI":
      //  ctx.onUIEvent?.(action.payload)
      //  break
    }
  }
}

function mapGameActionToUIEvent(action: GameAction): GameUIEvent | null {
  switch (action.type) {
    case "GAME_SOLVED":
      return { type: "solved", solvedResult: action.solvedResult }
    case "GAME_MISTAKE":
      return { type: "mistake", count: action.count }

    default:
      return null
  }
}

function emitUIEvents(
    actions: GameAction[],
    onUIEvent?: (f: GameUIEvent) => void
) {
    for (const action of actions) {
        const uiEvent = mapGameActionToUIEvent(action)
        if (uiEvent) onUIEvent?.(uiEvent)
    }
}