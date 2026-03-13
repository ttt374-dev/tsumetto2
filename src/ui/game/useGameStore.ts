import { Position, type Move } from "@/domain/kif/entity"
import { sameMove } from "@/domain/kif/rules"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { useMemo } from "react"
import { create } from "zustand"

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

export function useCurrentPosition() {
  const initial = useGameStore(s => s.initialPosition)
  const moves = useGameStore(s => s.moves)
  const ply = useGameStore(s => s.ply)

  return useMemo(
    () => buildUntilPly({initial, moves}, ply),
    [initial, moves, ply]
  )
}
export const selectIsLast = (s: GameStore) => {
    return s.ply >= s.moves.length && (s.moves.length > 0)
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
        set({initialPosition: pos, moves: moves, ply: 0, 
            mistakes: 0, revealed: false, resolved: false})
    },   

    moveTo: (ply) => {        
        if (ply > get().moves.length) return
        set({ply})
    },
    advancePly: () => {
        //console.log("adv ply")
        const { moveTo, ply} = get()
        moveTo(ply+1)                
    },
    retreatPly: () => {
        const { moveTo, ply} = get()
        moveTo(ply-1)        
    },
    tryMove: (move: Move) => {
        const { moves, ply, advancePly} = get()
        if (!sameMove(moves[ply], move)){  // 誤回答
            set(s=>({mistakes: s.mistakes+1}))
            return false
        }
        advancePly()  // 自手
        if (ply >= moves.length - 1) { // is last
            console.log("try move: resolved")
            set({ resolved: true })
        } else {
            
            setTimeout(advancePly, 500)  //　応手
        }
        return true
    },
    //makeResolve: () => { set({resolved: true})},
    //makeMistake: () => { set(s=>({mistakes: s.mistakes+1}))},
    revealAnswer: () => { set({revealed: true})},
    reset: () => {
        set({ ply: 0, mistakes: 0, revealed: false, resolved: false,
         })
    },
    //resetResolved: () => { set({resolved: false})}
}))