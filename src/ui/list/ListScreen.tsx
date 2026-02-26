import type { ProblemId } from "@/domain/problem/entity/Problem";
import { AppShell } from "../common/components/layout/AppShell";
import { ListView } from "./ListView";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

type ViewerLocationState = {
    title: string
  ids: string[]
}

export function ListScreen(){

    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"
    const handleSeletProblem = (id: ProblemId) => {
        navigate(routes.problemView(id))

    }

    return (
        <AppShell header={ title }>
            <ListView ids={ids} onSelectProblem={handleSeletProblem}/>            
        </AppShell>
    )
}