import type { Move, Player, Position } from "@/domain/kif/entity";
import type { BuildPositionResult } from "@/domain/kif/service/buildUntilPly";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { Selection } from "@/ui/screens/player/store/useBoardInputStore";

export type PlayerInput = {
    resPosition: BuildPositionResult

    problem: Problem
    isRevealed: boolean
    isSolved: boolean
    ply: number
    elapsedSec: number
    learningState: LearningState
    displayReversed: boolean
    userSide: Player
    moves: Move[]
    selection: Selection
    isMovesVisible: boolean    
}

//export type BoardViewModel = 
//    | BoardOKViewModel
//    | { status: "error", message?: string}
//export type BoardViewModel = 
export type BoardViewModel = {
    //status: "ok";
    position: Position
    reversed: boolean
    userSide: Player  
    
    selection: Selection
    lastMove: Move | undefined
    //ply: number
    //moves: Move[]

    buildPositionResult: BuildPositionResult

}
export type MovesViewModel = {
    //problem: Problem
    ply: number
    maxPly: number
    moves: Move[]
    visible: boolean
    userSide: Player
    learningState: LearningState
    isRevealed: boolean
    isSolved: boolean
}
export type PlayerDialogsState = {
    learningState: LearningState
    //solvedResult: SolvedResult
}
export type PlayerViewModel = {
    board: BoardViewModel
    moves: MovesViewModel
    dialogs: PlayerDialogsState
}
