import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"

export type GameEvent =
  | { type: "SOLVED", mistakes: number, isRevealed: boolean }
  | { type: "MISTAKE", mistakes: number}
  | { type: "REVEALED"}
  | { type: "AUTO_ADVANCE_REQUESTED"; delayMs: number, expectedPly: number }

export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PieceType
}

type GameStore = {
    initialPosition: Position
    moves: Move[]
    ply: number
    pendingPromotion: PendingPromotion | null

    mistakes: number
    isRevealed: boolean
    isSolved: boolean
    //hasFiredOnSolved: boolean
    event: GameEvent | null

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    applyIntent: (intent: Intent) => boolean
    choosePromotion: (promote: boolean) => void,
    tryMove: (move: Move) => boolean

    revealAnswer: () => void
    reset: () => void     
    
    // イベント操作
    clearEvent: () => void
}

//// selector
export const selectGameState = (s: GameStore) => ({
    initialPosition: s.initialPosition,
    moves: s.moves,
    ply: s.ply
})
export const selectIsLast = (s: GameStore) => {
    return s.ply >= s.moves.length && (s.moves.length > 0)
}
export function useCurrentPosition() {
  const { initialPosition, moves, ply } = useGameStore(useShallow(selectGameState))

  return useMemo(
    () => buildUntilPly(initialPosition, moves, ply),
    [initialPosition, moves, ply]
  )
}

////////////////////////////////////
export const useGameStore = create<GameStore>((set, get) => ({
    initialPosition: Position.empty(),
    moves: [],
    ply: 0,
    pendingPromotion: null,

    mistakes: 0,
    isRevealed: false,
    isSolved: false,
    //hasFiredOnSolved: false,

    //events: [],
    event: null,

    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
    },   
    reset: () => {
        set({
            ply: 0, mistakes: 0, isRevealed: false, isSolved: false,
            pendingPromotion: null,// hasFiredOnSolved: false,
            event: null
        })
    }, 

    moveTo: (ply: number) => {       // 範囲外でもclampして強制的に収める仕様     
        const max = get().moves.length
        //if (ply < 0 || ply > max) return
        set({ply: clampPly(ply, max)})
    },
    advancePly: () => {        
        const { moveTo, ply} = get()
        moveTo(ply+1)                
    },
    retreatPly: () => {
        const { moveTo, ply} = get()
        if (ply > 0) moveTo(ply - 1)
    },
    applyIntent(intent: Intent){
        const { initialPosition, moves, ply, tryMove} = get()        
        const position = buildUntilPly(initialPosition, moves, ply)        
        const result = resolveIntent(position, intent)
        if (!result) return false
        switch (result.type) {
            case "move":
                tryMove(result.move)                
                break;
            case "promotionPending":
                set({ pendingPromotion: result.pendingPromotion })
                break;
        }
        return true
    },      
    choosePromotion: (promote: boolean) => {        
        const pendingPromotion = get().pendingPromotion        
        if (!pendingPromotion) return
        const move = new Move(pendingPromotion.from, 
            pendingPromotion.to,
            pendingPromotion.pieceType,
            promote)
        set({pendingPromotion: null})
        get().tryMove(move)

    },
    tryMove: (move: Move) => {  // 正解なら true、間違いなら falseを返す
        const { moves, ply} = get()
        console.log("trymove", move)
        if (!move.equals(moves[ply])){   // 不正解
            //set(s => ({ mistakes: s.mistakes + 1 }))
            set(s => ({
                mistakes: s.mistakes + 1,
                event: { type: "MISTAKE", mistakes: s.mistakes + 1}
            }))
            return false
        }
        // 正解
        if (ply + 1 >= moves.length) { // 詰めあがり
            set(s => {
                //const alreadyFired = s.hasFiredOnSolved                
                const event: GameEvent = {
                    type: "SOLVED",
                    mistakes: s.mistakes,
                    isRevealed: s.isRevealed,
                }
                return ({ 
                    ply: s.ply + 1, 
                    isSolved: true,
                    //hasFiredOnSolved: true,
                    //events: alreadyFired ? s.events : [...s.events, event] })
                    event: {
                            type: "SOLVED",
                            mistakes: s.mistakes,
                            isRevealed: s.isRevealed,
                        }
                }
            )})
        } else {   // 自手と応手を進める
            set(s => { 
                const nextPly = clampPly(s.ply + 1, s.moves.length)

                return {
                    ply: nextPly,
                    event: {
                        type: "AUTO_ADVANCE_REQUESTED",
                        delayMs: 500,
                        expectedPly: nextPly
                    }
                }
            })        

        }
        return true
    },
    //revealAnswer: () => { set({ isRevealed: true }) },
    revealAnswer: () => {
        set(s => ({
            isRevealed: true,
            event: { type: "REVEALED" }
        }))
    },
    

    clearEvent: () => {
        set({ event: null })
    },

}))

//////////////
function clampPly(ply: number, max: number) {
  return Math.max(0, Math.min(ply, max))
}