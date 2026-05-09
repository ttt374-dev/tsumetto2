
import type { BoardViewModel, PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";

//////////////////////////////////////////////
export function buildPlayerViewModel(input: PlayerInput): PlayerViewModel {
    const { resPosition, problem, isRevealed, ply, learningState, isSolved,
        displayReversed, userSide, moves,
        selection, isMovesVisible,
     } = input


    return {
        //board,
        board: {
            position: resPosition.value,
            reversed: displayReversed,
            userSide, lastMove: moves[ply-1],
            selection, 
            buildPositionResult: resPosition, 
        },        

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
