import type { ProblemId } from "@/domain/problem/Problem";
import { useProblemDetailDialog } from "../common/problemDetail/useProblemDetailDialog";
import { useListDialog } from "../mission/ListDialog";
import type { PlayerViewNavigationHandlers } from "./components/PlayerView";
import { useRightActionsDrawer } from "./components/RightActionsDrawer";
import type { usePlayerController } from "./usePlayerController";


export function usePlayerPresenter(
    id: ProblemId,
    ids: ProblemId[],
    controller: ReturnType<typeof usePlayerController>,
    navigationHandlers: PlayerViewNavigationHandlers,
) {
    const detailDialog = useProblemDetailDialog(
        () => { },
        controller.updateProblem, //handleUpdateProblem, 
        () => { navigationHandlers.next() })
    const listDialog = useListDialog(id, ids, navigationHandlers.moveTo)
    const rightActionsDrawer = useRightActionsDrawer(
        () => detailDialog.openDialog(id),
        listDialog.openDialog
    )

    return {
        dialogs: {
            detail: detailDialog,
            list: listDialog,
        },
        rightActionsDrawer,
    }
}

