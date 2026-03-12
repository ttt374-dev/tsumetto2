import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useRightActionsDrawer } from "../components/RightActionsDrawer";
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";


export function usePlayerPresenter(p: Problem){
    const navigate = useNavigate()
        
    const rightActionsDrawer = useRightActionsDrawer(
        () => navigate(routes.detail(p.id))
    )

    return {
        rightActionsDrawer,
    }
}

