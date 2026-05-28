import { useShallow } from "zustand/react/shallow"
import { useMemo } from "react"
import { create } from "zustand"

import { Move, Position} from "@/domain/kif/entity"
import { buildUntilPly, type BuildPositionResult } from "@/domain/kif/service/buildUntilPly"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { projectGameState } from "@/domain/game/gameStateReducer"
import type { GameEvent, PendingPromotion } from "@/domain/game/types/GameEvent"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"

export type GameState =  { 
    mistakes: number 
    isRevealed: boolean 
    isHinted: boolean
    isSolved: boolean 
}    

export type GameStore = {
    sessionId: SessionId | undefined,
    loadedProblemId: ProblemId | undefined,
    events: GameEvent[]    // SoT
    state: GameState       // キャッシュ。events から derived
    initialPosition: Position
    moves: Move[]
    
    pendingPromotion: PendingPromotion | null
    
    initialize: (pos: Position, moves: Move[], sessionId?: SessionId) => void    
    startSession: (sessionId: SessionId) => void
    loadProblem: (problem: Problem) => void

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
    sessionId: undefined,
    loadedProblemId: undefined,
    initialPosition: Position.empty(),
    moves: [],
    pendingPromotion: null,
    events: [],
    hasSubmitted: false,
    userSide: "black",

    initialize: (pos, moves) => {        
        set({
            initialPosition: pos,
            moves,
            pendingPromotion: null,
            events: [],
            state: projectGameState([]),
        })
    },
    startSession: (sessionId) => {
        set({ sessionId, loadedProblemId: undefined})
    },
    loadProblem: (problem) => {
        if (get().loadedProblemId === problem.id) return
        get().initialize(problem.kifData.initialPosition, problem.kifData.moves)
        set({loadedProblemId: problem.id})
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