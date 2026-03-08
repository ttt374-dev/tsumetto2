
import { useProblemStore } from "@/ui/store/useProblemStore";
import { Navigate, useNavigate, useParams } from "react-router-dom"
import PlayerView from "../player/components/PlayerView";
import { AppShell } from "../common/components/layout/AppShell";
//import { useProblemDetailDialog } from '../detail/hooks/useProblemDetailDialog';
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { PlayerRightActions } from "../player/components/actions/PlayerRightActions";
import { routes } from "../App/useAppNavigation";

export function ViewerScreen() {
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return ViewerContent(problem)
}

function ViewerContent(problem: Problem) {
    //const detailDialog = useProblemDetailDialog()
    const navigate = useNavigate()

    return (
        <AppShell header="Viewer"
            rightActions={
                <PlayerRightActions 
                    problemId={problem.id} 
                    onOpenDetailDialog={()=>navigate(routes.detail(problem.id))}
                />
            }
        >
            <PlayerView problem={problem} title={problem.title} />
            
        </AppShell>
    )
}