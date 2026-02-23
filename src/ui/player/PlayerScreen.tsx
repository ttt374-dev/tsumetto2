import { PlayerAnswerActions } from "./components/PlayerAnswerActions"
import PlayerView from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { useLearningEventStore } from "@/ui/store/useLearningEventStore";
import { useTimer } from './hooks/useTimer';
import { useEffect } from 'react';
import { PlayerRightActions } from "./components/PlayerRIghtActions";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
    moveTo: (problemId: ProblemId) => void,
}

//////////////////////////////////////////////////////////////
export function PlayerScreen({ problem, title, onAnswer, problemNavigation}: {
    problem: Problem
    title: React.ReactNode
    onAnswer?: (id: ProblemId, res: SolvedResult, sec?: number) => void
    problemNavigation: ProblemNavigation
 }) {     
    const presenter = usePlayerPresenter(problem, problemNavigation.next)
    
    const review = useLearningEventStore(s=>s.review)
    const handleAnswer = async (res: SolvedResult) => {
        const sec = timer.seconds
        await review(problem.id, res, sec)  // 学習データを記録
        onAnswer?.(problem.id, res, sec)  // ミッションを進める
    }
    const handleOpenDetailDialog = () => {
        presenter.dialogs.detail.openDialog(problem.id)
    }
    const timer = useTimer()

    useEffect(() => {
        timer.reset()
        timer.start()        
    }, [problem.id])
    
    return (
        <AppShell
            header={title}
            footer={onAnswer && <PlayerAnswerActions onAnswerClick={handleAnswer} />}
            rightActions={<PlayerRightActions
                    problemId={problem.id} 
                    onOpenDetailDialog={handleOpenDetailDialog}/>}
        >
            <PlayerView
                problem={problem}                
                problemNavigation={problemNavigation}
                timer={timer}
            />
            {presenter.dialogs.detail.dialogElement}
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}