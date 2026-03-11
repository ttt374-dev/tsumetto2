import { Position, type Move, type PieceType, type Player } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { createDefaultSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning"
import type { Problem } from "@/domain/problem/entity/Problem"
import { create } from "zustand"

type ReplayStore = {
    //state
    initialPosition: Position
    moves: Move[]    
    solvedResult: SolvedResult      
    position: Position
    plyIndex: number
    firstPlayer: Player

    mistakes: number
    revealed: false
    
    // actions
    load: (problem: Problem) => void
    advancePly: () => void
    retreatPly: () => void
    moveToPly: (index: number) => void
    tryMove: (move: Move) => void    
    reveal: () => void   

    
    
}

// selectors
export const selectPosition = (state: ReplayStore) =>
    buildUntilPly(
        { initial: state.initialPosition, moves: state.moves },
        state.plyIndex
    )

export const selectIsLast = (s: ReplayStore) => {
    return s.plyIndex === s.moves.length && (s.moves.length > 0)
}
export const selectPlayer = (s: ReplayStore): Player =>
    s.position.sideToMove
    //s.plyIndex % 2 ? "white" : "black"

//export const selectIsUserTurn = (s: ReplayStore) =>
//    s.plyIndex % 2 === 0
///////////////////////////////////////
export const useReplayStore = create<ReplayStore>((set, get) => ({
    // problem
    initialPosition: Position.empty(),
    moves: [],
    solvedResult: createDefaultSolvedResult(),    
    firstPlayer: "black",

    mistakes: 0,
    revealed: false,

    // game
    position: Position.empty(),
    plyIndex: 0,
    moveToPly: (index: number) => {
        const { moves } = get()
        const newPlyIndex = Math.min(Math.max(index, 0), moves.length)
         
        set({
            plyIndex: newPlyIndex,
            position: buildUntilPly(
                { initial: get().initialPosition, moves },
                newPlyIndex
            ),
            mistakes: 0,
            revealed: false,
        })
    },
    advancePly: () => {
        const { position, moves, plyIndex } = get()
        const move = moves[plyIndex]
        if (!move) return
        const next = position.applyMove(move)

        set({
            position: next,
            plyIndex: plyIndex + 1
        })
    },
    retreatPly: () => {
        get().moveToPly(get().plyIndex-1)
    },
    reveal: () => {
        set(s => ({
            solvedResult: {
                ...s.solvedResult,
                //outcome: "failed",
                revealed: true
            }
        }))              
    },

    load: (problem: Problem) => {
        set({
            initialPosition: problem.kifData.initialPosition,
            position: problem.kifData.initialPosition,
            moves: problem.kifData.moves,
            solvedResult: createDefaultSolvedResult(),
        })
        get().moveToPly(0)
    },
    tryMove: (move: Move) => {
        const { moves, plyIndex} = get()
        const expectedMove = moves[plyIndex]

        // 不正解
        if (!movesEqual(move, expectedMove)) {
            set(s => ({
                solvedResult: {
                    ...s.solvedResult,
                    mistakes: s.solvedResult.mistakes + 1
                }
            }))
            return
        }

        // 正解
        get().advancePly()  // 先手
        if (get().plyIndex === moves.length) {
            set(s => ({
                solvedResult: {
                    ...s.solvedResult,
                    outcome: s.solvedResult.revealed ? "failed" : "solved"
                }
            }))
            return
        }

        const nextPly = get().plyIndex

        setTimeout(() => {
            const { plyIndex } = get()

            if (plyIndex === nextPly) {
                get().advancePly()
            }
        }, 500)

        
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
    //a.pieceType === b.pieceType &&
    a.promote === b.promote
  )
}