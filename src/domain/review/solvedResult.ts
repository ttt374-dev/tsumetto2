export type SolvedOutcome = "solved" | "failed" | "abandoned" | "unanswered"

export type SolvedResult = {
    //outcome: SolvedOutcome
    mistakes: number
    isRevealed: boolean
    hint: boolean
    isSolved: boolean
    elapsedSec: number
}

export function createDefaultSolvedResult( partial: Partial<SolvedResult> = {}): SolvedResult {
    return {
        //outcome: "unanswered",
        mistakes: 0,
        isRevealed: false,
        isSolved: false,
        hint: false,
        elapsedSec: 10,
        ...partial
    }
}
export type AssistLevel = "none" | "hint" | "movesRevealed"