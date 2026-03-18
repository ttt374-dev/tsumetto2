import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"

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
    revealed: boolean
    resolved: boolean

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    applyIntent: (intent: Intent) => boolean
    choosePromotion: (promote: boolean) => void,
    tryMove: (move: Move) => boolean

    revealAnswer: () => void
    reset: () => void        
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
    revealed: false,
    resolved: false,

    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
    },   
    reset: () => {
        set({
            ply: 0, mistakes: 0, revealed: false, resolved: false,
            pendingPromotion: null,
        })
    }, 

    moveTo: (ply) => {        
        const max = get().moves.length
        if (ply < 0 || ply > max) return
        set({ply})
    },
    advancePly: () => {
        //console.log("adv ply")
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
        const { moves, ply, advancePly} = get()
        console.log("trymove", move)
        if (!move.equals(moves[ply])){   // 不正解
            set(s => ({ mistakes: s.mistakes + 1 }))
            return false
        }
        // 正解
        if (ply + 1 >= moves.length) { // 詰めあがり
            set(s => ({ ply: s.ply + 1, resolved: true }))
        } else {   // 自手と応手を進める
            advancePly()
            //const nextPly = get().ply + 1
            setTimeout(() => {
                const state = get()
                //if (state.ply === nextPly) {
                state.advancePly()
                //}
            }, 500)

        }
        return true


    },
    revealAnswer: () => { set({revealed: true})},
 
}))
