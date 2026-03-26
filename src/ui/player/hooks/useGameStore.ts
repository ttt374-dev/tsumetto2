import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { resolveIntent, type Intent } from "@/domain/game/intentResolver"

type GamePhase = "playing" | "finished" 
export type GameState =  { mistakes: number, isRevealed: boolean, isSolved: boolean }    

export type GameEvent =
  | { type: "SOLVE" }
  | { type: "MISTAKE", ply: number, elapsedSec: number}
  | { type: "REVEAL", ply: number}
  //| { type: "ABANDON", ply: number}
  
export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PieceType
}

type GameStore = {
    phase: GamePhase,
    state: GameState,
    initialPosition: Position
    moves: Move[]
    ply: number
    pendingPromotion: PendingPromotion | null
    hasSubmitted: boolean    
    event: GameEvent | null
    events: GameEvent[]

    initialize: (pos: Position, moves: Move[]) => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    handleIntent: (intent: Intent, elaspedSec: number) => boolean
    //choosePromotion: (promote: boolean) => void,
    tryMove: (move: Move, elaspedSec: number) => boolean

    revealAnswer: () => void
    applyOpponentMove: () => void
    reset: () => void     
    finalize: () => GameState | null
    clearEvent: () => void
    markSubmit: () => void
    
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
    event: null,
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
            event: null,
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
    handleIntent(intent: Intent, elapsedSec: number){
        console.log("handle intent", intent, elapsedSec)
        const { initialPosition, moves, ply, tryMove} = get()     
        
        switch(intent.type){
            case "move":
            case "drop":
                const position = buildUntilPly(initialPosition, moves, ply)
                const result = resolveIntent(position, intent)

                if (!result) return false
                switch (result.type) {
                    case "move":
                        tryMove(result.move, elapsedSec)
                        break;
                    case "promotionPending":
                        set({ pendingPromotion: result.pendingPromotion })
                        break;
                }
                return true
            case "choosePromotion":
                const pendingPromotion = get().pendingPromotion
                if (!pendingPromotion) return false

                const move = new Move(
                    pendingPromotion.from,
                    pendingPromotion.to,
                    pendingPromotion.pieceType,
                    intent.promote
                )

                set({ pendingPromotion: null })
                tryMove(move, elapsedSec)
                return true
        }

    },
    tryMove: (move: Move, elapsedSec: number) => {  // 正解なら true、間違いなら falseを返す
        const { moves, ply} = get()
        console.log("trymove", move)
        if (!move.equals(moves[ply])) {   // 不正解
            //set(s => ({ mistakes: s.mistakes + 1 }))
            const event: GameEvent = {
                type: "MISTAKE", ply: ply, elapsedSec: elapsedSec
            }
            set(s => ({
                event: event, 
                events: [...s.events, event],
                state: {
                    ...s.state,
                    mistakes: s.state.mistakes + 1,
                },
            }))
            return false
        }
        // 正解
        if (ply + 1 >= moves.length) { // 詰めあがり
            set(s => {
                //const alreadyFired = s.hasFiredOnSolved                
                //set({phase: "finished"})
                const event: GameEvent = {
                    type: "SOLVE"
                }
                return ({ 
                    ply: s.ply + 1, 

                    state: {
                        ...s.state,
                        isSolved: true,
                    },
                    event: event,
                    events: [...s.events, event],
                    result: "solved",
                }
            )})
        } else {   // 自手と応手を進める
            get().advancePly()    
            get().applyOpponentMove()
        }
        return true
    },
    applyOpponentMove: () => {
        // TOOD
        setTimeout(() => {
            set(s => {
                const nextPly = clampPly(s.ply + 1, s.moves.length)
                return {
                    ply: nextPly,

                }
            })
        }, 500)

    },
    revealAnswer: () => {
        const event: GameEvent = {
            type: "REVEAL", ply: get().ply
        }
        set(s => ({
            state: {
                ...s.state,
                isRevealed: true,
            },
            event: event,
            events: [...s.events, event]
        }))
    },
    finalize: (): GameState | null => {
        const s = get()
        if (s.phase === "finished") return null

        set({ phase: "finished" })
        return s.state
    },
    clearEvent: () => {
        set({ event: null})
    },
    markSubmit: ()=>{
        set({hasSubmitted: true})
    }

}))

//////////////
// pure helpers
function clampPly(ply: number, max: number) {
  return Math.max(0, Math.min(ply, max))
}