
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView, { type ProblemNavigation } from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Button, IconButton, type SxProps } from "@mui/material"
import type { SolvedResult } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";
import { StarToggleButton } from "../common/components/StarToggleButton";
import { usePlayerViewModel, useShowMovesController } from "./hooks/usePlayerViewModel";
import { useStarToggleButton } from "@/application/useStarToggleButton";

//////////////////////////////////////////////////////////////
export function PlayerScreen({ problem, title, onAnswer, navigationHandlers}: {
    problem: Problem
    title: string
    onAnswer?: (id: ProblemId, res: SolvedResult, sec?: number) => void
    navigationHandlers: ProblemNavigation
 }) {
    const vm = usePlayerViewModel(problem, navigationHandlers)
    const starController = useStarToggleButton(problem.id)    

    const handleAnswer = async (res: SolvedResult, sec?: number) => {
        await vm.answerCurrent(res, sec)
        onAnswer?.(problem.id, res, sec)
    }
    
    return (
        <AppShell
            header={title}
            footer={onAnswer && <PlayerAnswerActions onAnswerClick={handleAnswer} />}
            rightActions={
                <>
                    <StarToggleButton
                        starred={starController.starred}
                        onToggle={starController.toggleStar}
                        sx={{ color: "white" }}
                    />
                    <IconButton onClick={vm.presenter.rightActionsDrawer.openDialog}>
                        <MoreVertIcon sx={{ color: "white" }} />
                    </IconButton>
                </>
            }
        >
            <PlayerView
                moves={problem.kifData.moves}
                position={problem.kifData.initialPosition}
                tags={problem.tags}
                problemNavigation={vm.handlers.navigation}
            />
            {vm.presenter.dialogs.detail.dialogElement}
            {vm.presenter.dialogs.list.dialogElement}
            {vm.presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}