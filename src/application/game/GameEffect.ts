import type { SessionEvent } from "@/application/session/SessionEvent";
import type { SolvedResult } from "@/domain/review/solvedResult";

export type GameEffect =
    | { type: "ADVANCE_PLY"; direction: "FORWARD" | "BACKWARD" }
    | { type: "MOVE_TO"; to: number }
    | { type: "START_ANIMATION" }
    | { type: "END_ANIMATION" }
    | { type: "WAIT"; ms: number }
    | { type: "STOP_TIMER" }

    | { type: "OPEN_DIALOG", dialog: "solvedResult", payload: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string }

    | { type: "EMIT_EVENT", event: SessionEvent}
