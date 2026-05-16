import { useEffect } from "react";

import type { Problem } from "@/domain/problem/entity/Problem";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { createPlayerContext } from "@/ui/screens/player/runner/createPlayerContext";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import { useToast } from "@/ui/App/providers/ToastProvider";
import type { Move, Player, Position } from "@/domain/kif/entity";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import type { Selection } from "@/ui/screens/player/store/useBoardInputStore";

export type BoardViewModel = {
    position: Position
    reversed: boolean
    userSide: Player  
    
    selection: Selection
    lastMove: Move | undefined
    nextMove: Move | undefined
    boardFlash: boolean
}
export type MovesViewModel = {
    ply: number
    maxPly: number
    moves: Move[]
    visible: boolean
    userSide: Player
    learningState: LearningState
    isRevealed: boolean
    isSolved: boolean
}
export type PlayerDialogsState = {
    learningState: LearningState
}
export type PlayerViewModel = {
    board: BoardViewModel
    moves: MovesViewModel
    dialogs: PlayerDialogsState
}
///////////////////////////////////////////////
export function usePlayerViewModel(problem: Problem): PlayerViewModel {
    const toast = useToast()

    const resPosition = useCurrentPosition()
    const isRevealed = useGameStore(s => s.state.isRevealed)
    const isSolved = useGameStore(s=>s.state.isSolved)

    const records = useLearningRecordStore(s => s.stateRecords)
    const learningState = records[problem.id]

    const displayReversed = useGameUIStore(s => s.isReversed)
    const userSide = useGameUIStore(s => s.userSide)
    const boardFlash = useGameUIStore(s=>s.boardFlash)
    const selection = useBoardInputStore(s => s.selection)
    const isMovesVisible = useGameUIStore(s=>s.isMovesVisible)
    const ctx = createPlayerContext()    

    useEffect(()=>{
        if (resPosition.ok === false){
            toast({message: `Build position error: ${resPosition.error.code} at ${resPosition.move.rawtext} ply of ${resPosition.ply}`, severity: "error"})
        }
    }, [resPosition.ok])

    const moves = problem.kifData.moves
    const { ply } = ctx
     return {
        board: {
            position: resPosition.value,
            reversed: displayReversed,
            userSide, lastMove: moves[ply-1],
            nextMove: moves[ply],
            selection, boardFlash,            
        },        

        moves: {
            moves,
            maxPly: moves.length,
            visible: isMovesVisible,
            ply, userSide, learningState,
            isRevealed, isSolved,
        },
        dialogs: {
            learningState
        }
    }
}