import type { Move, Player, Position } from "@/domain/kif/entity";
import type { BuildPositionResult } from "@/domain/kif/service/buildUntilPly";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { GameEvent } from "@/ui/screens/player/store/useGameStore";

export type PlayerInput = {
    resPosition: BuildPositionResult
    //reversed: boolean

    problem: Problem
    isRevealed: boolean
    ply: number
    elapsedSec: number
    learningState: LearningState
    displayReversed: boolean
    userSide: Player
}

export type BoardViewModel = 
    | BoardOKViewModel
    | { status: "error", message?: string}

export type BoardOKViewModel = {
    status: "ok";
    position: Position
    reversed: boolean
    userSide: Player    

}
export type MovesViewModel = {
    //problem: Problem
    ply: number
    maxPly: number
    moves: Move[]
    visible: boolean
    userSide: Player
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
