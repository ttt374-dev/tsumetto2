
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useParams } from "react-router-dom"
import PlayerView from "../player/components/PlayerView";
import { AppShell } from "../common/components/layout/AppShell";
import { IconButton, Stack } from "@mui/material";
import { useProblemDetailDialog } from '../common/components/dialogs/problemDetail/useProblemDetailDialog';
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { PlayerRightActions } from "../player/components/actions/PlayerRightActions";

export function ViewerScreen() {
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return ViewerContent(problem)
}

function ViewerContent(problem: Problem) {
    const detailDialog = useProblemDetailDialog()

    return (
        <AppShell header={problem.title}
            rightActions={
                <PlayerRightActions 
                    problemId={problem.id} 
                    onOpenDetailDialog={()=>detailDialog.openDialog(problem.id)}
                />
            }
        >
            <PlayerView problem={problem} />
            {detailDialog.dialogElement}
        </AppShell>
    )
}