import type { GameEvent, GameState } from "@/ui/screens/player/store/useGameStore"

export function reduceGameState(state: GameState, e: GameEvent): GameState {
    switch (e.type) {
        case "MISTAKE":
            return {
                ...state,
                mistakes: state.mistakes + 1,
            }

        case "REVEAL":
            return {
                ...state,
                isRevealed: true,
            }

        case "SOLVE":
            return {
                ...state,
                isSolved: true,
            }

        case "ABANDON":
            // 状態は変えない（終了イベントとして扱うだけ）
            return state

        default:
            return state
    }
}

const DefaultGameState: GameState = {
    mistakes: 0,
    isRevealed: false,
    isSolved: false,
}

export function projectGameState(events: GameEvent[]): GameState {
    return events.reduce(reduceGameState, DefaultGameState)
}