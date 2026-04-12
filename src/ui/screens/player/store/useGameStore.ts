import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType, type Player } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { projectGameState } from "@/domain/game/gameStateReducer"

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
    | ({type: "ADVANCE_PLY"} & BaseEvent )
    | ({type: "ADVANCE_OPPONENT_PLY"} & BaseEvent )
    | ({type: "ADVANCE_TURN"} & BaseEvent )
    
export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PieceType
}
export type GameContext = {
    elapsedSec: number
    ply: number
}
    
export type GameStore = {
    events: GameEvent[]    // SoT
    state: GameState       // キャッシュ。events から derived
    initialPosition: Position
    moves: Move[]
    //hasSubmitted: boolean
    displayReversed: boolean
    userSide: Player

    pendingPromotion: PendingPromotion | null
    
    initialize: (pos: Position, moves: Move[]) => void    

    choosePromotion: (promote: boolean) => Move
    promotionPending: (p: PendingPromotion) => void
    
    dispatch: (e: GameEvent) => GameEvent[]
    //markSubmit: () => void    
    toggleReversed: () => void,
    toggleUserSide: () => void,
    
}
export function useCurrentPosition() {
    const { initialPosition, moves } = useGameStore(
        useShallow(s => ({
            initialPosition: s.initialPosition,
            moves: s.moves
        }))
    )
  const ply = useReplayStore(s=>s.ply)

  return useMemo(
    () => buildUntilPly(initialPosition, moves, ply),
    [initialPosition, moves, ply]
  )
}
export function getCurrentPosition (): Position {
  const { initialPosition, moves } = useGameStore.getState()
  const ply = useReplayStore.getState().ply
  return buildUntilPly(initialPosition, moves, ply)
}

//const DefaultGameState = { mistakes: 0, isRevealed: false, isSolved: false}

////////////////////////////////////
export const useGameStore = create<GameStore>((set, get) => ({
    state: projectGameState([]),
    initialPosition: Position.empty(),
    moves: [],
    pendingPromotion: null,
    events: [],
    hasSubmitted: false,
    displayReversed: false,
    userSide: "black",
    //userSide: "white",

    initialize: (pos, moves) => {
        set({
            initialPosition: pos,
            moves,
            pendingPromotion: null,
            events: [],
            state: projectGameState([]),
            displayReversed: false,
            userSide: "black"
        })
    },
    
    promotionPending: (p: PendingPromotion) => {
        set({ pendingPromotion: p })
    },
    choosePromotion: (promote: boolean) => {
        const pendingPromotion = get().pendingPromotion
        //if (!pendingPromotion) return null
        if (!pendingPromotion) throw new Error("pendintPromotion null on choose promotion")
        set({ pendingPromotion: null })
        return createMoveFromPendingPromotion(pendingPromotion, promote)
    },
    dispatch: (e): GameEvent[] => {
        let nextEvents: GameEvent[] = []

        set(s => {
            nextEvents = [...s.events, e]
            return {
                events: nextEvents,
                state: projectGameState(nextEvents)
            }
        })

        //return nextEvents
        return nextEvents
    },
    toggleReversed: () =>  
        set(s => ({ displayReversed: !s.displayReversed})),
    toggleUserSide: () => 
        set(s => ({ userSide: s.userSide === "black" ? "white" : "black"})),
    
}))

//////////////
// pure helpers

function createMoveFromPendingPromotion(pendingPromotion: PendingPromotion, promote: boolean) {
    return new Move(
        pendingPromotion.from,
        pendingPromotion.to,
        pendingPromotion.pieceType,
        promote
    )
}