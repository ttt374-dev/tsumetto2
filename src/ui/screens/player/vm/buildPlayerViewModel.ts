import type { Move, Position } from "@/domain/kif/entity";
import type { BuildPositionResult } from "@/domain/kif/service/buildUntilPly";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";

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
export type GameEffect =
    | { type: "OPEN_DIALOG", dialog: "solvedResult", solvedResult: SolvedResult }
    | { type: "CLOSE_DIALOG", dialog: "solvedResult" }
    | { type: "TOAST", message: string }
    
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