import type { Problem } from "@/domain/problem/entity/Problem"
import { useSolvedDialogController } from "@/ui/screens/player/dialogs/SolvedDialog"
import { usePlayerActions, type PlayerActions } from "@/ui/screens/player/hooks/usePlayerActions"
import { usePlayerViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel"
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog"
import type { DialogControllers } from "@/ui/screens/player/runner/usePlayerRunner"
import type { PlayerViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";

export type PlayerPresentation = {
    state: PlayerViewModel
    actions: PlayerActions
    ui: {
        dialogs: DialogControllers
    }
}
export function usePlayerPresentation(problem: Problem): PlayerPresentation {
    const dialogs = {
        solvedResult: useSolvedDialogController(),
        promotion: usePromotionDialog(),
    }
    return {
        state: usePlayerViewModel(problem),
        actions: usePlayerActions(),
        ui: {
            dialogs
        }
    }
}