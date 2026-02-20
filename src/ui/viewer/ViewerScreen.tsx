import { StarToggleButton } from "../common/components/StarToggleButton";
import EditIcon from '@mui/icons-material/Edit';

import { useProblemStore } from "@/application/store/useProblemStore";
import { useParams } from "react-router-dom"
import PlayerView from "../player/components/PlayerView";
import { AppShell } from "../common/layout/AppShell";
import { IconButton } from "@mui/material";
import { useProblemDetailDialog } from '../common/problemDetail/useProblemDetailDialog';
import { useStarToggleButton } from "@/application/useStarToggleButton";

export function ViewerScreen() {
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    const starController = useStarToggleButton(problem.id)    
    const detailDialog = useProblemDetailDialog()

    return (
        <AppShell header={problem.title}
            rightActions={
                <>
                    <StarToggleButton
                        starred={starController.starred}
                        onToggle={starController.toggleStar}
                        sx={{ color: "white" }}
                    />
                    <IconButton
                        sx={{ color: "white" }}
                        onClick={() => detailDialog.openDialog(problem.id)}>
                        <EditIcon />
                    </IconButton>
                </>
            }
        >
            <PlayerView problem={problem} />
            {detailDialog.dialogElement}
        </AppShell>
    )
}