import { useNavigate } from "react-router-dom";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { routes } from "@/ui/App/useAppNavigation";
import { useCallback } from "react";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";

export function usePlayerViewModel(
    problem: Problem,  
    options?: { onUIEvent?: (e: GameUIEvent) => void }
) {
    const toast = useToast()
    const navigate = useNavigate()
    const deleteProblem = useProblemStore(s => s.deleteProblem)
    const dispatch = useGameStore(s => s.dispatch)

    // initialize
    const isIntialized = useGameInitializer(problem)   

    // dialogs
    const dialogs = {
        solvedResult: useSolvedDialog(),
        promotion: usePromotionDialog(),
    }

    // handlers    
    const handleUIEvent = useCallback((uiEvent: GameUIEvent) => {
        switch (uiEvent.type) {
            case "solved":
                dialogs.solvedResult.openDialog(problem.id, uiEvent.solvedResult)
                break
            case "mistake":
                toast({ message: `mistake: ${uiEvent.count}` })
                break
            case "solvedConfirmed":
                dialogs.solvedResult.closeDialog()
                break

        }
        // ⭐ 外にも流す
        options?.onUIEvent?.(uiEvent)
    }, [problem.id, toast, dialogs.solvedResult])    
    useGameEventHandler(handleUIEvent, isIntialized)

    const actions = {
        deleteProblem: (pid: ProblemId) => {
            if (!window.confirm("sure to delete ? ")) return
            deleteProblem(pid)
            toast({ message: `deleted: ${pid}` })
        },
        dispatchReveal: () => {
            const ctx = createPlayerContext()
            dispatch({ type: "REVEAL", ...ctx })
        },
        navigateToDetail: (pid: ProblemId) => {
            navigate(routes.detail(pid))
        },

    }
    return { handleUIEvent, actions, dialogs }

}