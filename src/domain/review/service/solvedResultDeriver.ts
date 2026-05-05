import { projectGameState } from "@/domain/game/gameStateReducer"
import type { GameEvent } from "@/domain/game/types/GameEvent"
import type { SolvedOutcome, SolvedResult } from "@/domain/review/solvedResult"
import type { GameState } from "@/ui/screens/player/store/useGameStore"

export function deriveOutcome(solvedResult: SolvedResult): SolvedOutcome{
    let outcome: SolvedOutcome

    if (solvedResult.isSolved) {
        outcome = solvedResult.isRevealed ? "failed" : "solved"
    } else {
        outcome = !solvedResult.isRevealed && solvedResult.mistakes === 0 ? "abandoned" : "failed"
    }
    return outcome
}
export function deriveSolvedResult(gameState: GameState, elapsedSec: number): SolvedResult {
    return {
        mistakes: gameState.mistakes,
        isRevealed: gameState.isRevealed,
        isSolved: gameState.isSolved,
        elapsedSec,
    }
}

function findFinalEvent(events: GameEvent[]) {
    return [...events].reverse().find(e =>
        e.type === "SOLVE" || e.type === "ABANDON"
    )
}

export function deriveSolvedResultFromEvents(events: GameEvent[]): SolvedResult {
    const state = projectGameState(events)
    const finished = findFinalEvent(events)
    const elapsedSec = finished?.elapsedSec ?? events[-1]?.elapsedSec ?? 0    

    return deriveSolvedResult(state, elapsedSec)
}