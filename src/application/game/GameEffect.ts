import type { SessionEvent } from "@/application/session/SessionEvent";
import type { SolvedResult } from "@/domain/review/solvedResult";
import type { AlertColor } from "@mui/material";

export type GameEffect =
    | { type: "ADVANCE_PLY"; direction: "FORWARD" | "BACKWARD" }
    | { type: "MOVE_TO"; to: number }
    | { type: "START_ANIMATION" }
    | { type: "END_ANIMATION" }
    | { type: "WAIT"; ms: number }
    | { type: "STOP_TIMER" }

    | { type: "OPEN_DIALOG", dialog: "solvedResult", payload: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string, severity?:  AlertColor }
    | { type: "FLASH_BOARD"}

    //| { type: "EMIT_EVENT", event: SessionEvent}
