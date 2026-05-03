import { useCallback } from "react";

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext";
import { useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";
import { buildPlayerViewModel, type PlayerInput, type PlayerViewModel } from "@/ui/screens/player/vm/buildPlayerViewModel";

export type MovesAction = {
    advancePly: () => void,
    retreatPly: () => void,
    reveal: () => void,
}
export type NavigationAction = {
    nextProblem: () => void
    showList: () => void
    navigateToDetail: (pid: ProblemId) => void
}
export type PlayerRunnerModel = {
    state: PlayerViewModel
    actions: {
        moves: MovesAction    
        navigation: NavigationAction
        domain: {
            deleteProblem: (pid: ProblemId) => void
        }
    }
    handlers: {
        handleUIEvent: (e: GameUIEvent) => void        
    }
    effects: {
        dialogs: {
            solvedResult: any
            promotion: any
        }
    }
}
/////////////////////////////////////////
export function usePlayerRunner(problem: Problem,
    options?: { onPlayerIntent?: (e: PlayerIntent) => void}    
): PlayerRunnerModel {
    const resPosition = useCurrentPosition()
    const reversed = useGameStore(s=>s.displayReversed)
    const isRevealed = useGameStore(s=>s.state.isRevealed)
    const dispatch = useGameStore(s => s.dispatch)
    const ctx = createPlayerContext()
    const records = useLearningRecordStore(s=>s.stateRecords)
    const learningState = records[problem.id]
    const deleteProblem = useProblemStore(s => s.deleteProblem)
    const toast = useToast()
    const navigate = useNavigate()

    const input: PlayerInput = {
        resPosition, reversed,
        problem, isRevealed,
        ...ctx, learningState,
    }
    const vm = buildPlayerViewModel(input)
    const dialogs = {
        solvedResult: useSolvedDialog(),
        promotion: usePromotionDialog(),
    }
    // initialize
    const isIntialized = useGameInitializer(problem)
    // handlers    
    const handleUIEvent = useCallback((uiEvent: GameUIEvent) => {
        switch (uiEvent.type) {
            case "solved":
                dialogs.solvedResult.openDialog(problem.id, uiEvent.solvedResult)
                options?.onPlayerIntent?.({ type: "PROBLEM_SOLVED" })
                break
            case "solvedConfirmed":
                dialogs.solvedResult.closeDialog()
                options?.onPlayerIntent?.({ type: "NEXT_REQUESTED" })
                break
            case "mistake":
                toast({ message: `mistake: ${uiEvent.count}` })
                break

        }
    }, [problem.id, toast, dialogs.solvedResult])
    useGameEventHandler(handleUIEvent, isIntialized)

    return {
        state: vm,
        actions: {
            moves: {
                advancePly: () => dispatch({ type: "ADVANCE_PLY", ...ctx }),
                retreatPly: () => dispatch({ type: "RETREAT_PLY", ...ctx }),
                reveal: () => dispatch({ type: "REVEAL", ...ctx }),
            },
            navigation: {
                nextProblem: () => options?.onPlayerIntent?.({ type: "NEXT_REQUESTED" }),
                showList: () => options?.onPlayerIntent?.({ type: "LIST_REQUESTED" }),
                navigateToDetail: (pid: ProblemId) => navigate(routes.detail(pid)),
            },
            domain: {
                deleteProblem: (pid: ProblemId) => {
                    if (!window.confirm("sure to delete ? ")) return
                    deleteProblem(pid)
                    toast({ message: `deleted: ${pid}` })
                },
            },
        },
        handlers: {
            handleUIEvent, 
        },
        effects: {
            dialogs,
        }
        
    }
}