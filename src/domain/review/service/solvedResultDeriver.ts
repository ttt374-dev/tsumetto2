import type { SolvedOutcome, SolvedResult } from "@/domain/review/solvedResult"
import { projectGameState } from "@/ui/player/hooks/gameStateReducer"
import type { GameEvent, GameState } from "@/ui/player/hooks/useGameStore"

export function deriveSolvedResult(gameState: GameState, elapsedSec: number): SolvedResult {
    let outcome: SolvedOutcome

    if (gameState.isSolved) {
        outcome = gameState.isRevealed ? "failed" : "solved"
    } else {
        outcome = !gameState.isRevealed && gameState.mistakes === 0 ? "unanswered" : "failed"
    }
    return {
        outcome,
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
    const elapsedSec = finished?.elapsedSec ?? 0

    return deriveSolvedResult(state, elapsedSec)
}