import type { SolvedResult } from "@/domain/review/types/solvedResult";
import type { AlertColor } from "@mui/material";

export type EffectSoundKind = "solved" | "mistake"
export type GameEffect =
    | { type: "ADVANCE_PLY"}
    | { type: "RETREAT_PLY"}
    | { type: "MOVE_TO"; to: number }
    | { type: "START_ANIMATION" }
    | { type: "END_ANIMATION" }
    | { type: "WAIT"; ms: number }
    | { type: "STOP_TIMER" }

    | { type: "OPEN_SOLVED_RESULT_DIALOG", solvedResult: SolvedResult }
    | { type: "CLOSE_SOLVED_RESULT_DIALOG"}
    | { type: "TOAST", message: string, severity?:  AlertColor }
    | { type: "FLASH_BOARD"}
    | { type: "PLAY_SOUND", kind: "mistake" | "solved"}

