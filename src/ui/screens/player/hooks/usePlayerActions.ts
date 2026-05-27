import { useNavigate } from "react-router-dom";

import type { ProblemId } from "@/domain/problem/entity/Problem";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { createPlayerContext } from "@/ui/screens/player/runner/createPlayerContext";
import { useGameStore } from "@/ui/screens/player/store/useGameStore";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";
import type { PieceType, Player, Square } from "@/domain/kif/entity";
import type { Intent } from "@/domain/game/intentResolver";
import type { GameEvent, PendingPromotion } from "@/domain/game/types/GameEvent";
import { useHintStore } from "@/application/hint/useHintStore";
import { createGameEventBaseScope } from "@/domain/game/decideGameEvent";
import { useProblemMutation } from "@/ui/features/problem/hooks/useProblemMutation";

export type PlayerActions = {
    board: BoardActions
    moves: MovesActions
    navigation: NavigationActions
    game: GameActions
    domain: {
        deleteProblem: (pid: ProblemId) => void
    }
    hint: {
        revealHint: (hint: string) => void
    }
}
export type BoardActions = {
    dispatchGameEvent: (e: GameEvent) => void
    promotionPending: (p: PendingPromotion) => void
    clickSquare: (sq: Square) => Intent | null
    clickHandPiece: (pieceType: PieceType, owner: Player) => void
    clearSelection: () => void
}
export type MovesActions = {
    advancePly: () => void,
    retreatPly: () => void,
    reveal: () => void,
    moveToPly: (ply: number) => void,
    setMovesVisible: (value: boolean) => void
    toggleMovesVisible: () => void
}
export type NavigationActions = {

    navigateToDetail: (pid: ProblemId) => void
}

type GameActions = {
    toggleReversed: () => void
    toggleUserSide: () => void
}
///////////////////////////////////////
export function usePlayerActions(): PlayerActions {

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

    const toggleHint = useHintStore(s=>s.toggleCandidateVisible)
    const revealHint = (hint: string) => {
        toggleHint()         
        dispatch({type: "REVEAL_HINT", hint, ...scope})
    }
    const { deleteProblem } = useProblemMutation()

    const toast = useToast()
    const navigate = useNavigate()

    const scope = createGameEventBaseScope()

    return {
        board: {
            dispatchGameEvent,
            promotionPending,
            clickSquare,
            clearSelection,
            clickHandPiece,
        },

        moves: {
            advancePly: () => dispatch({ type: "ADVANCE_PLY", ...scope }),
            retreatPly: () => dispatch({ type: "RETREAT_PLY", ...scope }),
            reveal: () => {
                dispatch({ type: "REVEAL", ...scope })
                setMovesVisible(true)
            },
            moveToPly: (to: number) => dispatch({ type: "MOVETO_PLY", to, ...scope }),
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

        hint: {
            revealHint,
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