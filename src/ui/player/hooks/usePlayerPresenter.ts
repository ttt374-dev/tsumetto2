import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useProblemDetailDialog } from "../../common/problemDetail/useProblemDetailDialog";
import { useListDialog } from "../../mission/ListDialog";
import type { PlayerViewNavigationHandlers } from "../components/PlayerView";
import { useRightActionsDrawer } from "../components/RightActionsDrawer";


export function usePlayerPresenter(
    p: Problem,
    //onUpdateProblem: (p: Problem) => void,
    navigationHandlers: PlayerViewNavigationHandlers,
) {
    const detailDialog = useProblemDetailDialog(
        () => { navigationHandlers.next() }
        //() => { },
        //onUpdateProblem, //handleUpdateProblem,p 
        
        //() => { navigationHandlers.next() }
    )
    const listDialog = useListDialog(p.id, navigationHandlers.moveTo)
    const rightActionsDrawer = useRightActionsDrawer(
        () => detailDialog.openDialog(p.id),
        //listDialog.openDialog
    )

    return {
        dialogs: {
            detail: detailDialog,
            list: listDialog,
        },
        rightActionsDrawer,
    }
}

