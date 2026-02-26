import { PlayerAnswerActions } from "./components/actions/PlayerAnswerActions"
import PlayerView from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { useLearningEventStore } from "@/ui/store/useLearningEventStore";
import { useTimer } from './hooks/useTimer';
import { useEffect } from 'react';
import { PlayerRightActions } from "./components/actions/PlayerRightActions";
import type { SolvedResult } from "@/domain/learning/entity/Learning";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
//    moveTo: (problemId: ProblemId) => void,
}

type AnswerCapability = {
  answer: (res: SolvedResult, sec: number) => void
}

type NavigationCapability = {
    next: () => void
    prev: () => void
}

type PlayerCapabilities = {
  answer?: AnswerCapability
  navigation?: NavigationCapability

}
//////////////////////////////////////////////////////////////
export function PlayerScreen({ problem, title, capabilities}: {
    problem: Problem
    title: React.ReactNode
    capabilities: PlayerCapabilities
 }) {     
    const presenter = usePlayerPresenter(problem, capabilities.navigation?.next)
    const timer = useTimer()
    
    //const review = useLearningEventStore(s=>s.review)
    const handleAnswer = async (res: SolvedResult) => {
        capabilities.answer?.answer?.(res, timer.seconds)  // ミッションを進める
    }
    const handleOpenDetailDialog = () => {
        presenter.dialogs.detail.openDialog(problem.id)
    }

    useEffect(() => {
        timer.reset()
        timer.start()        
    }, [problem.id])
    
    return (
        <AppShell
            header={title}
            footer={capabilities.answer && <PlayerAnswerActions onAnswerClick={handleAnswer} />}
            rightActions={<PlayerRightActions
                    problemId={problem.id} 
                    onOpenDetailDialog={handleOpenDetailDialog}/>}
        >
            <PlayerView
                problem={problem}                
                problemNavigation={capabilities.navigation}
                timer={timer}
            />
            {presenter.dialogs.detail.dialogElement}
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}