import { Position, type Move } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { set } from "lodash"
import { create } from "zustand"

type GameStore = {
    initialPosition: Position
    position: Position
    moves: Move[]
    ply: number

    mistakes: number
    revealed: boolean

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    madeMistake: () => void
    revealAnswer: () => void
    reset: () => void

}
export const selectIsLast = (s: GameStore) => {
//    console.log("islast", s.ply, s.moves)    
    return s.ply >= s.moves.length && (s.moves.length > 0)
}
////////////////////////////////////
export const useGameStore = create<GameStore>((set, get) => ({
    initialPosition: Position.empty(),
    position: Position.empty(),
    moves: [],
    ply: 0,

    mistakes: 0,
    revealed: false,

    initialize: (pos, moves) => {
        console.log("initialize", pos)
        set({initialPosition: pos, position: pos, 
            moves: moves, ply: 0, mistakes: 0, revealed: false})
        //get().moveTo(0)
    },   

    moveTo: (ply) => {
        console.log("moveto")
        const { initialPosition, moves } = get()        
        set({
            position: buildUntilPly({initial: initialPosition, moves}, ply)        ,
            ply
        })
    },
    advancePly: () => {
        console.log("adv ply")
        const { moveTo, ply} = get()
        moveTo(ply+1)        
        /*
        const { position, moves, ply } = get()
        const move = moves[ply]
        if (!move) return
        const next = position.applyMove(move)

        set({
            position: next,
            ply: ply + 1
        })*/
    },
    retreatPly: () => {
        const { moveTo, ply} = get()
        moveTo(ply-1)        
    },

    madeMistake: () => { set(s=>({mistakes: s.mistakes+1}))},
    revealAnswer: () => { set({revealed: true})},
    reset: () => {
        set({ ply: 0, position: get().initialPosition,
            mistakes: 0, revealed: false,
         })
    }
}))