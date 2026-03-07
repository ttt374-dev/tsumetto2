import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useProblemDetailDialog } from "../../detail/hooks/useProblemDetailDialog";
import { useRightActionsDrawer } from "../components/RightActionsDrawer";


export function usePlayerPresenter(p: Problem, onNextProblem?: () => void){
    const detailDialog = useProblemDetailDialog(onNextProblem)
        
    const rightActionsDrawer = useRightActionsDrawer(
        () => detailDialog.openDialog(p.id),
    )

    return {
        dialogs: {
            detail: detailDialog,
        },
        rightActionsDrawer,
    }
}

