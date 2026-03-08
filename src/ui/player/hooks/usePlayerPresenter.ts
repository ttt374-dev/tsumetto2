import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
//import { useProblemDetailDialog } from "../../detail/hooks/useProblemDetailDialog";
import { useRightActionsDrawer } from "../components/RightActionsDrawer";
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";


export function usePlayerPresenter(p: Problem, onNextProblem?: () => void){
    //const detailDialog = useProblemDetailDialog(onNextProblem)
    const navigate = useNavigate()
        
    const rightActionsDrawer = useRightActionsDrawer(
        () => navigate(routes.detail(p.id))
    )

    return {

        rightActionsDrawer,
    }
}

