export type SolvedOutcome = "solved" | "failed" | "abandoned" | "unanswered"

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

