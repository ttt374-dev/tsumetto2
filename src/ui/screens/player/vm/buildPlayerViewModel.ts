import type { Move, Position } from "@/domain/kif/entity";
import type { BuildPositionResult } from "@/domain/kif/service/buildUntilPly";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";

export type PlayerInput = {
    resPosition: BuildPositionResult
    reversed: boolean

    problem: Problem
    isRevealed: boolean
    ply: number
    elapsedSec: number
    learningState: LearningState
}

export type BoardViewModel = 
    | { status: "ok";
        reversed: boolean
        position: Position }
    | { status: "error", message?: string}

export type MovesViewModel = {
    //problem: Problem
    ply: number
    maxPly: number
    moves: Move[]
    visible: boolean
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