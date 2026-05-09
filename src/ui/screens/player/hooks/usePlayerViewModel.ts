
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { createPlayerContext } from "@/ui/screens/player/runner/createPlayerContext";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { buildPlayerViewModel, } from "@/ui/screens/player/vm/buildPlayerViewModel";
import type { PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useEffect } from "react";

export function usePlayerViewModel(problem: Problem): PlayerViewModel {
    const toast = useToast()

    const resPosition = useCurrentPosition()
    const isRevealed = useGameStore(s => s.state.isRevealed)
    const isSolved = useGameStore(s=>s.state.isSolved)

    const records = useLearningRecordStore(s => s.stateRecords)
    const learningState = records[problem.id]

    const displayReversed = useGameUIStore(s => s.isReversed)
    const userSide = useGameUIStore(s => s.userSide)

    const selection = useBoardInputStore(s => s.selection)
    const isMovesVisible = useGameUIStore(s=>s.isMovesVisible)
    const ctx = createPlayerContext()

    useEffect(()=>{
        if (resPosition.ok === false){
            toast({message: `Build position error: ${resPosition.error.code} at ${resPosition.move.rawtext} ply of ${resPosition.ply}`, severity: "error"})
        }
    }, [resPosition.ok])

    const input: PlayerInput = {
        resPosition,
        problem,
        isRevealed,
        isSolved,
        ...ctx,
        learningState,
        displayReversed,
        userSide,
        selection,
        moves: problem.kifData.moves,
        isMovesVisible
    }

    return buildPlayerViewModel(input)
}