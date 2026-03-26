import { projectGameState } from "@/ui/player/hooks/gameStateReducer"
import type { GameEvent, GameState } from "@/ui/player/hooks/useGameStore"

export type SolvedOutcome = "solved" | "failed" | "unanswered"

export type SolvedResult = {
    outcome: SolvedOutcome
    mistakes: number
    isRevealed: boolean
    isSolved: boolean
    elapsedSec: number
}
export function createDefaultSolvedResult(): SolvedResult {
    return {
        outcome: "unanswered",
        mistakes: 0,
        isRevealed: false,
        isSolved: false,
        elapsedSec: 10,
    }
}

