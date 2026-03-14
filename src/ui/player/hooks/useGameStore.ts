import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Position, type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveMove } from "./intentResolver"
import { ResetTv } from "@mui/icons-material"


type GameStore = {
    initialPosition: Position
    //position: Position
    moves: Move[]
    ply: number

    mistakes: number
    revealed: boolean
    resolved: boolean

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
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
    tryMove: (move: Move) => {
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