import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, resolveMove, type Intent } from "./intentResolver"
import { ResetTv } from "@mui/icons-material"


type GameStore = {
    initialPosition: Position
    //position: Position
    moves: Move[]
    ply: number
    promotionMove: Move | null

    mistakes: number
    revealed: boolean
    resolved: boolean

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    applyIntent: (intent: Intent) => void
    applyMove: (move: Move) => boolean

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
    promotionMove: null,

    mistakes: 0,
    revealed: false,
    resolved: false,

    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
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
        const { initialPosition, moves, ply, applyMove, promotionMove} = get()
        
        if (intent.type === "choosePromotion") {
            const move = promotionMove
            if (!move) return

            const finalMove = new Move(
                move.from,
                move.to,
                move.pieceType,
                intent.promote
            )
            //playMove(finalMove)
            //advancePly()
            applyMove(finalMove)

            set({ promotionMove: null })
            return
        }

        const position = buildUntilPly(initialPosition, moves, ply)
        const result = resolveIntent(position, intent)
        console.log("resovleintent", result)
        if (!result) return
        if (result.type === "promotionPending"){ 
            set({promotionMove: result.move})
            return
        }
        return applyMove(result.move)

    },
    applyMove: (move: Move) => {
        const { moves, ply, advancePly} = get()
        const result = resolveMove(moves, ply, move)
        switch (result.type) {
            case "incorrect":
                set(s => ({ mistakes: s.mistakes + 1 }))
                return false

            case "solved":
                set(s => ({ ply: s.ply + 1, resolved: true }))
                return true

            case "playerAndOpponent":
                advancePly()
                setTimeout(() => {
                    const { ply, moves } = get()
                    if (ply < moves.length) {
                        advancePly()
                    }
                }, 500)
                return true
        }
        return false
    },    
    
    revealAnswer: () => { set({revealed: true})},
    reset: () => {
        set({ ply: 0, mistakes: 0, revealed: false, resolved: false,
         })
    },    
}))