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
                { type: "ADVANCE_PLY" },
                { type: "STOP_TIMER" },
                { type: "OPEN_SOLVED_RESULT_DIALOG", solvedResult: solvedResult },
                { type: "PLAY_SOUND", kind: "solved"}
            ]
        case "MISTAKE":
            return [{ type: "FLASH_BOARD"}, { type: "PLAY_SOUND", kind: "mistake"}]
            //return [{ type: "TOAST", message: `mistake: ${ctx.mistakes}`, severity: "error" } ]
        case "ADVANCE_PLY":
            return [{ type: "ADVANCE_PLY"}]
        case "RETREAT_PLY":
            return [{ type: "RETREAT_PLY"}]
        case "MOVETO_PLY":
            return [{ type: "MOVE_TO", to: e.to }]
        case "ADVANCE_TURN":
            return [
                { type: "ADVANCE_PLY" },
                { type: "START_ANIMATION" },
                { type: "WAIT", ms: 500 },
                { type: "ADVANCE_PLY" },
                { type: "END_ANIMATION" }
            ]
        case "REVEAL_HINT":
            if (e.hint) return [{type: "TOAST", message: e.hint}]            
            return []
            
        default:
            return []
    }
}
