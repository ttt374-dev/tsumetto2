import { useNavigate } from "react-router-dom";

import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { createPlayerContext } from "@/ui/screens/player/runner/createPlayerContext";
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import type { PieceType, Player, Square } from "@/domain/kif/entity";
import type { Intent } from "@/domain/game/intentResolver";
import type { GameEvent, PendingPromotion } from "@/domain/game/types/GameEvent";

export type PlayerRunnerAction = {
    board: BoardAction
    moves: MovesAction
    navigation: NavigationAction
    game: GameAction
    domain: {
        deleteProblem: (pid: ProblemId) => void
    }
}
export type BoardAction = {
    dispatchGameEvent: (e: GameEvent) => void
    promotionPending: (p: PendingPromotion) => void
    clickSquare: (sq: Square) => Intent | null
    clickHandPiece: (pieceType: PieceType, owner: Player) => void
    clearSelection: () => void
}
export type MovesAction = {
    advancePly: () => void,
    retreatPly: () => void,
    reveal: () => void,
    moveToPly: (ply: number) => void,
    setMovesVisible: (value: boolean) => void
    toggleMovesVisible: () => void
}
export type NavigationAction = {
    //nextProblem: () => void
    //showList: () => void
    navigateToDetail: (pid: ProblemId) => void
}

type GameAction = {
    toggleReversed: () => void
    toggleUserSide: () => void
}
///////////////////////////////////////
export function usePlayerActions(): PlayerRunnerAction {

    const dispatch = useGameStore(s => s.dispatch)

    const toggleReversed = useGameUIStore(s => s.toggleReversed)
    const toggleUserSide = useGameUIStore(s => s.toggleUserSide)
    const setMovesVisible = useGameUIStore(s=>s.setMovesVisible)
    const toggleMovesVisible = useGameUIStore(s=>s.toggleMovesVisible)

    const dispatchGameEvent = useGameStore(s => s.dispatch)
    const promotionPending = useGameStore(s => s.promotionPending)

    const clickSquare = useBoardInputStore(s => s.clickSquare)
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)
    const clearSelection = useBoardInputStore(s => s.clear)

    const deleteProblem = useProblemStore(s => s.deleteProblem)

    const toast = useToast()
    const navigate = useNavigate()

    const ctx = createPlayerContext()

    return {
        board: {
            dispatchGameEvent,
            promotionPending,
            clickSquare,
            clearSelection,
            clickHandPiece,
        },

        moves: {
            advancePly: () => dispatch({ type: "ADVANCE_PLY", ...ctx }),
            retreatPly: () => dispatch({ type: "RETREAT_PLY", ...ctx }),
            reveal: () => {
                dispatch({ type: "REVEAL", ...ctx })
                setMovesVisible(true)
            },
            moveToPly: (to: number) => dispatch({ type: "MOVETO_PLY", to, ...ctx }),
            setMovesVisible, toggleMovesVisible,
        },

        navigation: {
            navigateToDetail: (pid: ProblemId) =>
                navigate(routes.detail(pid)),
        },

        game: {
            toggleUserSide,
            toggleReversed,
        },

        domain: {
            deleteProblem: (pid: ProblemId) => {
                if (!window.confirm("sure to delete ? ")) return

                deleteProblem(pid)

                toast({
                    message: `deleted: ${pid}`,
                })
            },
        },
    }
}