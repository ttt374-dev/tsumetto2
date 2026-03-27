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

export type GameEvent =
  | { type: "SOLVE", ply: number, elapsedSec: number }
  | { type: "CORRECT", ply: number, elapsedSec: number}
  | { type: "MISTAKE", ply: number, elapsedSec: number}
  | { type: "REVEAL", ply: number, elapsedSec: number}
  | { type: "ABANDON", ply: number, elapsedSec: number }
  //| { type: "ABANDON", ply: number}
  
export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PieceType
}
export type GameContext = {
    elapseSec: number
    ply: number
}
//export type TryMoveResult = "correct" | "incorrect" | "solved"
    
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
    //handleIntent: (intent: Intent, elapsedSec: number) => boolean
    choosePromotion: (promote: boolean) => Move
    promotionPending: (p: PendingPromotion) => void
    //tryMove: (move: Move, elaspedSec: number) => TryMoveResult

    revealAnswer: (elapsedSec: number) => void
    applyOpponentMove: () => void
    reset: () => void     
    //finalize: () => GameState | null
    dispatch: (e: GameEvent) => void
    //clearEvent: () => void
    markSubmit: () => void
    markAbandon: (elapsedSec: number) => void
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
    //event: null,
    events: [],
    hasSubmitted: false,
    //result: null,
    
    initialize: (pos, moves) => {
        set({initialPosition: pos, moves})
        get().reset()
    },   
    reset: () => {        
        set({
            ply: 0, hasSubmitted: false,
            phase: "playing",
            pendingPromotion: null,
            //event: null,
            events: [],
            state: { ...DefaultGameState},
            //result: null,
        })
        console.log("reset", get().hasSubmitted)
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
    }, /*
    tryMove: (move: Move, elapsedSec: number) => { 
        const { dispatch, moves, ply} = get()
        //console.log("trymove", move)
        const res = evaluateMove(move, moves, ply)
        switch (res) {
            case "correct":
                get().advancePly()
                get().applyOpponentMove()
                break;
            case "incorrect":
                dispatch({ type: "MISTAKE", ply, elapsedSec })
                break;
            case "solved":
                dispatch({ type: "SOLVE", ply, elapsedSec })
                break;
        }
        return res
        
    },*/
    applyOpponentMove: () => {
        // TOOD
        setTimeout(() => {
            set(s => {
                const nextPly = clampPly(s.ply + 1, s.moves.length)
                return { ply: nextPly}
            })
        }, 500)

    },
    revealAnswer: (elapsedSec: number) => {        
        const event: GameEvent = {
            type: "REVEAL", ply: get().ply, elapsedSec
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
    markAbandon: (elapsedSec: number)=>{
        const event: GameEvent = {
            type: "ABANDON", ply: get().ply, elapsedSec
        }
        get().dispatch(event)
        //set({: true})
    }

}))

//////////////
// pure helpers
function evaluateMove(move: Move, moves: Move[], ply: number){
    if (!move.equals(moves[ply])) return "incorrect"
    if (ply+1>=moves.length) return "solved"
    return "correct"
}


function clampPly(ply: number, max: number) {
  return Math.max(0, Math.min(ply, max))
}