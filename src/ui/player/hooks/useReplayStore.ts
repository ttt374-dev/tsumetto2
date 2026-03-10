import { Position, Square, type Move, type PieceType, type Player } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import type { Problem } from "@/domain/problem/entity/Problem"
import { assignWith } from "lodash"
import { create } from "zustand"

//export type SolvePhase = "solving" | "completed" | "revealed"
export type ReplayPhase =
  | { type: "playing" }
  | { type: "completed", result: SolvedResult }
type TryMoveResult = "correct" | "incorrect" | "finish"

type ReplayStore = {
    // problem
    initialPosition: Position
    moves: Move[]
    load: (problem: Problem) => void

    // game
    replayPhase: ReplayPhase
    position: Position
    plyIndex: number
    advancePly: () => void
    retreatPly: () => void
    moveToPly: (index: number) => void
    tryMove: (move: Move) => TryMoveResult
    player: Player

    // session
    mistakes: number
    answerShown: boolean
}

export const selectPosition = (state: ReplayStore) =>
  buildUntilPly(
    { initial: state.initialPosition, moves: state.moves },
    state.plyIndex
  )

export const useReplayStore = create<ReplayStore>((set, get) => ({
    // problem
    initialPosition: Position.empty(),
    moves: [],
    player: "black",

    // game
    replayPhase: { type: "playing" },
    position: Position.empty(),
    plyIndex: 0,
    moveToPly: (index: number) => {

        const { moves } = get()
        const newPlyIndex = Math.min(Math.max(index, 0), moves.length)
         
        set({
            plyIndex: newPlyIndex,
            player: newPlyIndex % 2 ? "white" : "black",
            position: buildUntilPly(
                { initial: get().initialPosition, moves },
                newPlyIndex
            )
        })
    },
    advancePly: () => {
        //if (get().mistakes ===0) set({ mistakes: get().mistakes+1}) // TODO
        //set({answerShown: true})
        //console.log("advance ply")
        get().moveToPly(get().plyIndex+1)
    },
    retreatPly: () => {
        get().moveToPly(get().plyIndex-1)
    },

    // session
    mistakes: 0,
    answerShown: false,

    load: (problem: Problem) => {
        console.log("load", problem)
        set({
            initialPosition: problem.kifData.initialPosition,
            position: problem.kifData.initialPosition,
            moves: problem.kifData.moves,
            replayPhase: { type: "playing"},
            mistakes: 0,        
            answerShown: false,
        })
        get().moveToPly(0)
    },
    tryMove: (move: Move): TryMoveResult => {
        console.log("tryMove: ", move)
        const { moves, plyIndex, mistakes, answerShown } = get()

        const expectedMove = moves[plyIndex]

        // 不正解
        if (!movesEqual(move, expectedMove)) {
            set({
                mistakes: mistakes + 1,
            })
            console.log("try move incorrect", move, expectedMove, get().mistakes)
            return "incorrect"
        }

        // 正解
        get().advancePly()  // 先手
        if (get().plyIndex < moves.length) {
            setTimeout(()=>{
                get().advancePly()  // 後手も自動で進める
            }, 500)
            
        }

        const isLast = (get().plyIndex >= moves.length)
        console.log("islast", isLast, get().plyIndex, moves.length)
        const solvedResult: SolvedResult = {
            outcome: mistakes == 0 && answerShown === false ? "solved" : "failed",
            mistakes: mistakes,
            elapsedSec: 10, // TODO
            answerShown: answerShown,
        }
        console.log("try move correct: ", solvedResult  )
        const newphase: ReplayPhase =  isLast ? { type: "completed", result: solvedResult} : get().replayPhase

        set({

            replayPhase: newphase,            
        })
        return isLast ? "finish" : "correct"
        
    },

}))

///////////////
function movesEqual(a: Move, b?: Move) {
  if (!b) return false

  return (
    a.from?.file === b.from?.file &&
    a.from?.rank === b.from?.rank &&
    a.to.file === b.to.file &&
    a.to.rank === b.to.rank &&
    a.pieceType === b.pieceType &&
    a.promote === b.promote
  )
}