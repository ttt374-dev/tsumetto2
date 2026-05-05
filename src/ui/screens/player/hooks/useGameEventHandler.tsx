import { useEffect, useMemo, useRef } from "react"

import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { createRunControl, runGameEffects, type EffectRunnerDeps, type GameEffect } from "@/ui/screens/player/runner/runGameEffects"
import type { GameEvent } from "@/domain/game/types/GameEvent"

export function useGameEventHandler(deps: EffectRunnerDeps, enabled: boolean = true) {
    const events = useGameStore(s => s.events)
    const mistakes = useGameStore(s => s.state.mistakes)

    //const runner = useMemo(() => {
    //    return createGameEffectRunner(deps)
    //}, [deps])
    
    const controlRef = useRef(createRunControl())
    // イベント処理
    useEffect(() => {
        if (!enabled) return
        const last = events.at(-1)
        if (!last) return

        //console.log("event handler", last, events)
        const effects = interpretGameEvent(last, {
            events,
            mistakes,
        })
        //runner.run(effects)
        runGameEffects(effects, deps, controlRef.current)

    }, [events])
}
function interpretGameEvent(e: GameEvent,
    ctx: { events: GameEvent[]; mistakes: number }
): GameEffect[] {
    const solvedResult = deriveSolvedResultFromEvents(ctx.events)
    switch (e.type) {
        case "SOLVE":
            return [
                { type: "ADVANCE_PLY", direction: "FORWARD" },
                { type: "STOP_TIMER" },
                //{ type: "GAME_SOLVED", solvedResult: deriveSolvedResultFromEvents(ctx.events)},
                {
                    type: "EMIT_EVENT", event: {
                        type: "PROBLEM_SOLVED",
                        solvedResult: solvedResult
                    }
                },
                { type: "OPEN_DIALOG", dialog: "solvedResult", payload: solvedResult },
            ]
        case "MISTAKE":
            return [{ type: "TOAST", message: `mistake: ${ctx.mistakes}` }]
        case "ADVANCE_PLY":
            return [{ type: "ADVANCE_PLY", direction: "FORWARD" }]
        case "RETREAT_PLY":
            return [{ type: "ADVANCE_PLY", direction: "BACKWARD" }]
        case "MOVETO_PLY":
            return [{ type: "MOVE_TO", to: e.to }]
        //case "ADVANCE_OPPONENT_PLY":
        //    return [{ type: "REPLAY_ADVANCE_OPPONENT" }]
        case "ADVANCE_TURN":
            return [
                { type: "ADVANCE_PLY", direction: "FORWARD" },
                { type: "START_ANIMATION" },
                { type: "WAIT", ms: 500 },
                { type: "ADVANCE_PLY", direction: "FORWARD" },
                { type: "END_ANIMATION" }
            ]
        default:
            return []
    }
}

/*
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

      //case "REPLAY_ADVANCE_OPPONENT":
      //  ctx.replayCtrl.advanceOpponentPly()
      //  break

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
        */