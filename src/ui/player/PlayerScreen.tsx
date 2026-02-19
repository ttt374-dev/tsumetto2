
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Button, IconButton, type SxProps } from "@mui/material"
import type { SolvedResult } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";
import { StarToggleButton } from "../common/components/StarToggleButton";
import { useStarToggleButton } from "@/application/useStarToggleButton";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
    moveTo: (problemId: ProblemId) => void,
}
//////////////////////////////////////////////////////////////
export function PlayerScreen({ problem, title, onAnswer, problemNavigation}: {
    problem: Problem
    title: string
    onAnswer?: (id: ProblemId, res: SolvedResult, sec?: number) => void
    problemNavigation: ProblemNavigation
 }) {    
    const starController = useStarToggleButton(problem.id)    
    const presenter = usePlayerPresenter(problem, problemNavigation.next)

    const review = useLearningEventStore(s=>s.review)
    const handleAnswer = async (res: SolvedResult, sec?: number) => {
        await review(problem.id, res, sec)  // 学習データを記録
        onAnswer?.(problem.id, res, sec)  // ミッションを進める
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
                    <IconButton onClick={presenter.rightActionsDrawer.openDialog}>
                        <MoreVertIcon sx={{ color: "white" }} />
                    </IconButton>
                </>
            }
        >
            <PlayerView
                problem={problem}                
                problemNavigation={problemNavigation}
            />
            {presenter.dialogs.detail.dialogElement}
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}