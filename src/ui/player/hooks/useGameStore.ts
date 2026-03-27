import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"
import { reduceGameState } from "@/ui/player/hooks/gameStateReducer"
import { PlayLesson } from "@mui/icons-material"

type GamePhase = "playing" | "finished" 
export type GameState =  { mistakes: number, isRevealed: boolean, isSolved: boolean }    

type BaseEvent = {
    ply: number
    elapsedSec: number
}

export type GameEvent =
    | ({ type: "SOLVE" } & BaseEvent)
    | ({ type: "CORRECT" } & BaseEvent)
    | ({ type: "MISTAKE" } & BaseEvent)
    | ({ type: "REVEAL" } & BaseEvent)
    | ({ type: "ABANDON" } & BaseEvent)

export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PieceType
}
export type GameContext = {
    elapsedSec: number
    ply: number
}
    
type GameStore = {
    phase: GamePhase,
    state: GameState,
    initialPosition: Position
    moves: Move[]
    ply: number
    pendingPromotion: PendingPromotion | null
    hasSubmitted: boolean    
    //event: GameEvent | null
    events: GameEvent[]
    
    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    choosePromotion: (promote: boolean) => Move
    promotionPending: (p: PendingPromotion) => void    

    revealAnswer: (ctx: GameContext) => void
    applyOpponentMove: () => void
    reset: () => void     
    //finalize: () => GameState | null
    dispatch: (e: GameEvent) => void
    //clearEvent: () => void
    markSubmit: () => void
    markAbandon: (ctx: GameContext) => void
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
const DefaultGameState = { mistakes: 0, isRevealed: false, isSolved: false}

////////////////////////////////////
export const useGameStore = create<GameStore>((set, get) => ({
    phase: "playing",
    state: {...DefaultGameState},
    initialPosition: Position.empty(),
    moves: [],
    ply: 0,
    pendingPromotion: null,
    events: [],
    hasSubmitted: false,
    
    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
    },   
    reset: () => {        
        set({
            ply: 0, hasSubmitted: false,
            phase: "playing",
            pendingPromotion: null,
            events: [],
            state: { ...DefaultGameState},
        })
        console.log("reset", get().hasSubmitted)
    }, 

    moveTo: (ply: number) => {       // 範囲外でもclampして強制的に収める仕様     
        //console.log("mvoeTo: ", ply)
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
    promotionPending: (p: PendingPromotion) => {
        set({ pendingPromotion: p })
    },
    choosePromotion: (promote: boolean) => {
        const pendingPromotion = get().pendingPromotion
        //if (!pendingPromotion) return null
        if (!pendingPromotion) throw new Error("pendintPromotion null on choose promotion")
        set({ pendingPromotion: null })
        return new Move(
            pendingPromotion.from,
            pendingPromotion.to,
            pendingPromotion.pieceType,
            promote
        )
    }, 
    applyOpponentMove: () => {
        // TOOD
        setTimeout(() => {
            set(s => {
                const nextPly = clampPly(s.ply + 1, s.moves.length)
                return { ply: nextPly}
            })
        }, 500)

    },
    revealAnswer: (ctx: GameContext) => {        
        const event: GameEvent = {
            type: "REVEAL", ply: get().ply, elapsedSec: ctx.elapsedSec
        }
        get().dispatch(event)        
    },    
    dispatch: (e) => {
        set(s => ({
            events: [...s.events, e],
            state: reduceGameState(s.state, e),
        }))
    },
    markSubmit: ()=>{
        set({hasSubmitted: true})
    },
    markAbandon: (ctx: GameContext)=>{
        const event: GameEvent = {
            type: "ABANDON", ply: get().ply, elapsedSec: ctx.elapsedSec
        }
        get().dispatch(event)
    }

}))

//////////////
// pure helpers

function clampPly(ply: number, max: number) {
  return Math.max(0, Math.min(ply, max))
}