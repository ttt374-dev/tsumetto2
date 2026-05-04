
import type { GameFeedback } from "@/ui/screens/player/hooks/useGameEventHandler";
import type { GameEffect } from "@/ui/screens/player/runner/runGameEffects";
import type { BoardViewModel, PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";


//////////////////////////////////////////////
export function buildPlayerViewModel(input: PlayerInput): PlayerViewModel {
    const { resPosition, problem, isRevealed, ply, learningState, 
        displayReversed, userSide } = input

    const board: BoardViewModel = resPosition.ok 
        ? { status: "ok", 
            position: resPosition.value, 
            reversed: displayReversed,
            userSide: userSide,
            
        } 
        : { status: "error"}
    return {
        board,

        moves: {
            //problem, 
            moves: problem.kifData.moves,
            maxPly: problem.kifData.moves.length,
            visible: isRevealed,
            ply, userSide

        },
        dialogs: {
            learningState
        }
    }
}
////
export function decidePlayerIntent(e: GameFeedback): PlayerIntent | undefined {
    switch (e.type) {
        case "solved":
            return { type: "PROBLEM_SOLVED" }
        case "solvedConfirmed":
            return { type: "NEXT_REQUESTED" }
    }
}
export function decideGameEffect(e: GameFeedback): GameEffect | undefined {
    switch (e.type) {
        case "solved":
            return { type: "OPEN_DIALOG", dialog: "solvedResult", solvedResult: e.solvedResult }
        case "solvedConfirmed":
            return { type: "CLOSE_DIALOG", dialog: "solvedResult" }
        case "mistake":
            return { type: "TOAST", message: `mistakes: ${e.count}` }
    }
}