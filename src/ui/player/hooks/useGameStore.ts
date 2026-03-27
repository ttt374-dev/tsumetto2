import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { reduceGameState } from "@/ui/player/hooks/gameStateReducer"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"

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
    //ply: number
    pendingPromotion: PendingPromotion | null
    hasSubmitted: boolean    
    events: GameEvent[]
    
    initialize: (pos: Position, moves: Move[]) => void
    choosePromotion: (promote: boolean) => Move
    promotionPending: (p: PendingPromotion) => void    

    revealAnswer: (ctx: GameContext) => void
    //applyOpponentMove: () => void
    reset: () => void     
    //finalize: () => GameState | null
    dispatch: (e: GameEvent) => void
    //clearEvent: () => void
    markSubmit: () => void
    markAbandon: (ctx: GameContext) => void

    //advancePly: () => void
    //retreatPly: () => void    
    //moveTo: (ply: number) => void
    
}

//// selector


export function useCurrentPosition() {
  //const { initialPosition, moves } = useGameStore()
  //const ply = useGameStore(s=>s.ply)
  const initialPosition = useGameStore(s=>s.initialPosition)
  const moves = useGameStore(s=>s.moves)
  const ply = useReplayStore(s=>s.ply)
  console.log("usecurretnion posiont", ply)

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
    pendingPromotion: null,
    events: [],
    hasSubmitted: false,

    //ply: 0,
    
    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
    },   
    reset: () => {        
        set({
            //ply: 0,
            hasSubmitted: false,
            phase: "playing",
            pendingPromotion: null,
            events: [],
            state: { ...DefaultGameState},
        })
        console.log("reset", get().hasSubmitted)
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
    
    revealAnswer: (ctx: GameContext) => {        
        const event: GameEvent = {
            type: "REVEAL", ply: ctx.ply, elapsedSec: ctx.elapsedSec
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
            type: "ABANDON", ply: ctx.ply, elapsedSec: ctx.elapsedSec
        }
        get().dispatch(event)
    },

     

}))

//////////////
// pure helpers

function clampPly(ply: number, max: number) {
  return Math.max(0, Math.min(ply, max))
}