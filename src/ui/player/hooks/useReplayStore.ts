import { Position, Square, type Move, type PieceType, type Player } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import type { Problem } from "@/domain/problem/entity/Problem"
import { create } from "zustand"

export type SolvePhase = "solving" | "completed" | "revealed"

export type SelectedState =
    | { type: "idle"}
    | { type: "board", square: Square }
    | { type: "hand", pieceType: PieceType, player: Player}    
    | { type: "cancel"}
    | { type: "promotionConfirm"}
    | { type: "pendingPromotion"}

type ReplayStore = {
    // problem
    initialPosition: Position
    moves: Move[]
    load: (problem: Problem) => void

    // game
    solvePhase: SolvePhase
    //position: Position
    plyIndex: number
    advancePly: () => void
    retreatPly: () => void
    moveToPly: (index: number) => void
    tryMove: (move: Move) => void

    // session
    mistakes: number
    

    // ui
    selectedState: SelectedState
    selectSquare: (square: Square) => void    
    selectHandPiece: (pieceType: PieceType, owner: Player) => void
    unselect: () => void
    showMoves: boolean
    setShowMoves: (flag: boolean) => void

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

    // game
    solvePhase: "solving",
    //position: Position.empty(),
    plyIndex: 0,
    moveToPly: (index: number) => {
        const { moves } = get()
        const newPlyIndex = Math.min(Math.max(index, 0), moves.length)
         
        set({
            plyIndex: newPlyIndex,
            //position: buildUntilPly(
            //    { initial: initialPosition, moves },
            //    newPlyIndex
            //)
        })
    },
    advancePly: () => {
        set(state => ({
            plyIndex: Math.min(state.plyIndex + 1, state.moves.length)
        }))
    },
    retreatPly: () => {
        set(state => ({
            plyIndex: Math.max(state.plyIndex - 1, 0)
        }))
    },

    // session
    mistakes: 0,

    load: (problem: Problem) => {
        console.log("load", problem)
        set({
            initialPosition: problem.kifData.initialPosition,
            moves: problem.kifData.moves,
            showMoves: false,
            solvePhase: "solving",
            mistakes: 0,        
            selectedState: { type: "idle" }
        })
        get().moveToPly(0)
    },
    tryMove: (move: Move) => {
        console.log("tryMove: ", move)
        const { moves, plyIndex, mistakes } = get()

        const expectedMove = moves[plyIndex]

        // 不正解
        if (!movesEqual(move, expectedMove)) {
            set({
                mistakes: mistakes + 1,
                selectedState: { type: "idle"},
            }
            )
            return
        }

        // 正解
        //const nextPosition = position.applyMove(move)
        get().advancePly()  // 先手
        if (get().plyIndex < moves.length) {
            get().advancePly()  // 後手も自動で進める
        }

        //const nextPly = plyIndex + 1
        //const solved = get().plyIndex === moves.length

        const newphase =  (get().plyIndex + 1 >= moves.length) ? "completed" : get().solvePhase

        set({
            //position: nextPosition,
            //plyIndex: nextPly,
            selectedState: { type: "idle"},
            solvePhase: newphase,            
        })
        
    },
    // ui
    selectedState: { type: "idle"},
    selectSquare: (square: Square) => {
        set({
            selectedState: { 
                type: "board",
                square: square
            }
        })
    },
    selectHandPiece: (pieceType: PieceType, owner: Player) => {
        set({
            selectedState: {
                type: "hand",
                pieceType: pieceType,
                player: owner,
            }
        })
    },
    unselect: () => {
        set({ selectedState: { type: "idle"}})
    },
    showMoves: false,
    setShowMoves: (flag: boolean) => {
        set({ showMoves: flag})
    }
}))

///////////////
function movesEqual(a: Move, b?: Move) {
  if (!b) return false

  return (
    a.from?.file === b.from?.file &&
    a.from?.rank === b.from?.rank &&
    a.to.file === b.to.file &&
    a.to.rank === b.to.rank &&
    a.pieceType === b.pieceType
  )
}