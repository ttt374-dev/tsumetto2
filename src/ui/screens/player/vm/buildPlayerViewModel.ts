
import type { BoardViewModel, PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";

//////////////////////////////////////////////
export function buildPlayerViewModel(input: PlayerInput): PlayerViewModel {
    const { resPosition, problem, isRevealed, ply, learningState, isSolved,
        displayReversed, userSide,
        selection, moves, isMovesVisible,
     } = input

    const board: BoardViewModel = resPosition.ok 
        ? { status: "ok", 
            position: resPosition.value, 
            reversed: displayReversed,
            userSide: userSide,
            selection, moves, ply
        } 
        : { status: "error"}
    return {
        board,

        moves: {
            //problem, 
            moves: problem.kifData.moves,
            maxPly: problem.kifData.moves.length,
            visible: isMovesVisible,
            ply, userSide, learningState,
            isRevealed, isSolved,
        },
        dialogs: {
            learningState
        }
    }
}
