
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import type { GameEffect } from "@/ui/screens/player/runner/runGameEffects";
import type { BoardViewModel, PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";


//////////////////////////////////////////////
export function buildPlayerViewModel(input: PlayerInput): PlayerViewModel {
    const { resPosition, reversed, problem, isRevealed, ply, learningState} = input

    const board: BoardViewModel = resPosition.ok ? { status: "ok", position: resPosition.value, reversed} : { status: "error"}
    return {
        board,

        moves: {
            //problem, 
            moves: problem.kifData.moves,
            maxPly: problem.kifData.moves.length,
            visible: isRevealed,
            ply,
        },
        dialogs: {
            learningState
        }
    }
}
////
export function decidePlayerIntent(e: GameUIEvent): PlayerIntent | undefined {
    switch (e.type) {
        case "solved":
            return { type: "PROBLEM_SOLVED" }
        case "solvedConfirmed":
            return { type: "NEXT_REQUESTED" }
    }
}
export function decideGameEffect(e: GameUIEvent): GameEffect | undefined {
    switch (e.type) {
        case "solved":
            return { type: "OPEN_DIALOG", dialog: "solvedResult", solvedResult: e.solvedResult }
        case "solvedConfirmed":
            return { type: "CLOSE_DIALOG", dialog: "solvedResult" }
        case "mistake":
            return { type: "TOAST", message: `mistakes: ${e.count}` }
    }
}