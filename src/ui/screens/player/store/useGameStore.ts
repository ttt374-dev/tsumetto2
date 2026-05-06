import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position, Square, type PieceType, type Player, type PromotablePieceType } from "@/domain/kif/entity"
import { buildUntilPly, type BuildPositionResult } from "@/domain/kif/service/buildUntilPly"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { projectGameState } from "@/domain/game/gameStateReducer"
import type { GameEvent, PendingPromotion } from "@/domain/game/types/GameEvent"

export type GameState =  { mistakes: number, isRevealed: boolean, isSolved: boolean }    

export type GameStore = {
    events: GameEvent[]    // SoT
    state: GameState       // キャッシュ。events から derived
    initialPosition: Position
    moves: Move[]
    
    pendingPromotion: PendingPromotion | null
    
    initialize: (pos: Position, moves: Move[]) => void    

    choosePromotion: (promote: boolean) => Move
    promotionPending: (p: PendingPromotion) => void
    
    dispatch: (e: GameEvent) => GameEvent[]
    
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
export function getCurrentPosition (): BuildPositionResult {
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
    //displayReversed: false,
    userSide: "black",
    //userSide: "white",

    initialize: (pos, moves) => {
        set({
            initialPosition: pos,
            moves,
            pendingPromotion: null,
            events: [],
            state: projectGameState([]),
            //displayReversed: false,
            //userSide: "black"
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
    //toggleReversed: () =>  
    //    set(s => ({ displayReversed: !s.displayReversed})),
    //toggleUserSide: () => 
    //    set(s => ({ userSide: s.userSide === "black" ? "white" : "black"})),
    
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