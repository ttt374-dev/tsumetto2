import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext";
import { useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler, type GameFeedback } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import type { PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";
import { buildPlayerViewModel, decideGameEffect, decidePlayerIntent } from "@/ui/screens/player/vm/buildPlayerViewModel";
import { runGameEffects } from "@/ui/screens/player/runner/runGameEffects";
import type { PlayerInput, PlayerViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";

export type PlayerRunnerAction = {
    moves: MovesAction
    navigation: NavigationAction
    game: GameAction
    domain: {
        deleteProblem: (pid: ProblemId) => void
    }
}
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

type GameAction = {
    toggleReversed: () => void
    toggleUserSide: () => void
}
export type DialogControllers = {
   solvedResult: ReturnType<typeof useSolvedDialog>
   promotion: ReturnType<typeof usePromotionDialog>
}
export type PlayerRunnerModel = {
    state: PlayerViewModel
    actions: PlayerRunnerAction
    handlers: {
        handleUIEvent: (e: GameFeedback) => void
    }
    ui: {
        dialogs: DialogControllers
    }
}

/////////////////////////////////////////
export function usePlayerRunner(problem: Problem,
    options?: { onPlayerIntent?: (e: PlayerIntent) => void }
): PlayerRunnerModel {
    const resPosition = useCurrentPosition()    
    const isRevealed = useGameStore(s => s.state.isRevealed)
    const dispatch = useGameStore(s => s.dispatch)
    const ctx = createPlayerContext()
    const records = useLearningRecordStore(s => s.stateRecords)
    const learningState = records[problem.id]
    const deleteProblem = useProblemStore(s => s.deleteProblem)
    const toast = useToast()
    const navigate = useNavigate()
    const toggleReversed = useGameUIStore(s=>s.toggleReversed)
    const toggleUserSide = useGameUIStore(s=>s.toggleUserSide)
    const displayReversed = useGameUIStore(s=>s.reversed)
    const userSide = useGameUIStore(s=>s.userSide)

    const input: PlayerInput = {
        resPosition, 
        problem, isRevealed,
        ...ctx, learningState,
        displayReversed, userSide
    }
    const vm = buildPlayerViewModel(input)
    const dialogs = {
        solvedResult: useSolvedDialog(),
        promotion: usePromotionDialog(),
    }
    // initialize
    const isIntialized = useGameInitializer(problem)
    // handlers    
    const handleUIEvent = useCallback((uiEvent: GameFeedback) => {
        const intent = decidePlayerIntent(uiEvent)
        if (intent) options?.onPlayerIntent?.(intent)
        const gameEffect = decideGameEffect(uiEvent)
        if (gameEffect) {
            runGameEffects([gameEffect], {
                dialogs, toast, problemId: problem.id
            })
        }
    }, [problem.id, toast, dialogs.solvedResult, options])
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
            game: {
                toggleUserSide, toggleReversed,
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
        ui: {
            dialogs,
        }

    }
}

