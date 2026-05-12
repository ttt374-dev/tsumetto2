import type { GameEffect } from "@/application/game/GameEffect";
import type { GameEvent } from "@/domain/game/types/GameEvent";
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver";

export function interpretGameEvent(e: GameEvent,
    ctx: { events: GameEvent[]; mistakes: number }
): GameEffect[] {
    const solvedResult = deriveSolvedResultFromEvents(ctx.events)
    switch (e.type) {
        case "SOLVE":
            return [
                { type: "ADVANCE_PLY", direction: "FORWARD" },
                { type: "STOP_TIMER" },
                /*{ type: "EMIT_EVENT", event: {
                        type: "PROBLEM_SOLVED",
                        solvedResult: solvedResult
                    }
                },*/
                //{ type: "TOAST", message: "solved", severity: "success"},
                { type: "OPEN_DIALOG", dialog: "solvedResult", payload: solvedResult },
            ]
        case "MISTAKE":
            return [{ type: "FLASH_BOARD"}]
            //return [{ type: "TOAST", message: `mistake: ${ctx.mistakes}`, severity: "error" } ]
            //return [{ type: "T", message: `mistake: ${ctx.mistakes}`, severity: "error" } ]
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
