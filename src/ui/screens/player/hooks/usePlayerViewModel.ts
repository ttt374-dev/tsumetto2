import { useNavigate } from "react-router-dom";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useCurrentPosition, useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { routes } from "@/ui/App/useAppNavigation";
import { useCallback } from "react";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";
import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";
import type { Move, Position } from "@/domain/kif/entity";
import { Replay } from "@mui/icons-material";
import { useReplayController } from "@/ui/screens/player/hooks/useReplayController";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";

export type BoardViewModel = 
    | { status: "ok";
        reversed: boolean
        position: Position }
    | { status: "error", message?: string}

export type MovesViewModel = {
    problem: Problem
    ply: number
    moves: Move[]
    visible: boolean
    dispatchReveal: () => void
}
export type PlayerIntent = 
    | { type: "NEXT_REQUESTED" }
    | { type: "LIST_REQUESTED" }
    | { type: "PROBLEM_SOLVED" }


export function usePlayerViewModel(
    problem: Problem,  
    options?: { 
        onPlayerIntent?: (e: PlayerIntent) => void,
        onSessionCommand?: (e: SessionCommand) => void }
) {
    const toast = useToast()
    const navigate = useNavigate()
    const deleteProblem = useProblemStore(s => s.deleteProblem)
    const dispatch = useGameStore(s => s.dispatch)

    // initialize
    const isIntialized = useGameInitializer(problem)   

    // derived view models
    // board
    const reversed = useGameStore(s=>s.displayReversed)
    const resPosition = useCurrentPosition()
    const board: BoardViewModel = 
        resPosition.ok === false ? { status: "error", message: `invalid position: ${resPosition.ply}` } :
            { status: "ok", reversed, position: resPosition.value}
    
    // moves
    const ply = useReplayStore(s=>s.ply)
    const isRevealed = useGameStore(s=>s.state.isRevealed)
    const dispatchReveal = () => {
        const ctx = createPlayerContext()
        dispatch({ type: "REVEAL", ...ctx })
    }
    const moves: MovesViewModel = {
        problem, ply, moves: problem.kifData.moves, visible: isRevealed, dispatchReveal
    }
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
                options?.onPlayerIntent?.({ type: "PROBLEM_SOLVED"})
                //options?.onSessionCommand?.({ type: "SUBMIT_REVIEW" })
                break
            case "solvedConfirmed":
                dialogs.solvedResult.closeDialog()
                //options?.onSessionCommand?.({ type: "GO_NEXT" })
                options?.onPlayerIntent?.({type: "NEXT_REQUESTED"})
                break
            case "mistake":
                toast({ message: `mistake: ${uiEvent.count}` })
                break
            
        }
        // ⭐ 外にも流す
        //options?.on/\Event?.(uiEvent)
    }, [problem.id, toast, dialogs.solvedResult])    
    useGameEventHandler(handleUIEvent, isIntialized)

    const actions = {
        deleteProblem: (pid: ProblemId) => {
            if (!window.confirm("sure to delete ? ")) return
            deleteProblem(pid)
            toast({ message: `deleted: ${pid}` })
        },        
        navigateToDetail: (pid: ProblemId) => {
            navigate(routes.detail(pid))
        },
    }
    const issueSessionCommand = {
        nextProblem: () => {
            options?.onPlayerIntent?.({type: "NEXT_REQUESTED"})
            //options?.onSessionCommand?.({type: "GO_NEXT"})
        },
        showList: () => {
            options?.onPlayerIntent?.({type: "LIST_REQUESTED"})
            //options?.onSessionCommand?.({type: "GO_LIST"})
        }
    }
    const issueUiEvent = {
        confirmSolved: () => {
            handleUIEvent({type: "solvedConfirmed"})
        }
    }
    return { handleUIEvent, ...actions, problem,
        ...issueSessionCommand, ...issueUiEvent,
        board, moves,
        dialogs }

}
///////////////////
