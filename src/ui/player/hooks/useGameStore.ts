import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, type Intent } from "../../../domain/game/intentResolver"
import { resolveMove } from "@/domain/game/moveResolver"

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
    applyIntent: (intent: Intent) => void
    tryMove: (move: Move) => void    

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
        console.log("apply intent", intent)
        //if (!intent) return
        const { initialPosition, moves, ply, tryMove, pendingPromotion} = get()
        switch (intent.type) {
            case "drop":
            case "move":
                const position = buildUntilPly(initialPosition, moves, ply)
                const result = resolveIntent(position, intent)
                //console.log("resovleintent", result)
                if (!result) return
                switch(result.type){
                    case "move":
                        //if (!isValidMove(result.move)) return
                        tryMove(result.move)
                    break;
                }           
        }       

    },
    tryMove: (move: Move) => {
        const { moves, ply, advancePly} = get()
        console.log("trymove", move)
        const result = resolveMove(moves, ply, move)
        switch (result.type) {
            case "incorrect":
                set(s => ({ mistakes: s.mistakes + 1 }))
                break
            case "solved":
                set(s => ({ ply: s.ply + 1, resolved: true }))
                break
            case "playerAndOpponent":
                advancePly()
                //const nextPly = get().ply + 1

                setTimeout(() => {
                    const state = get()
                    //if (state.ply === nextPly) {
                        state.advancePly()
                    //}
                }, 500)
                break
        }

    },    
    
    revealAnswer: () => { set({revealed: true})},
 
}))
