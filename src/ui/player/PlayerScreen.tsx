import { PlayerAnswerActions } from "./components/actions/PlayerAnswerActions"
import PlayerView from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { useTimer } from './hooks/useTimer';
import { useEffect } from 'react';
import { PlayerRightActions } from "./components/actions/PlayerRightActions";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
}

type AnswerCapability = {
    answer: (problemId: ProblemId, res: SolvedResult, sec: number) => void
    undoLastAnswer?: () => void
}

type NavigationCapability = {
    next: () => void
    prev: () => void
}

type PlayerCapabilities = {
    answerable?: AnswerCapability
    navigatable?: NavigationCapability
}
//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, capabilities }: {
    problem: Problem
    title: React.ReactNode
    capabilities: PlayerCapabilities
}) {
    const presenter = usePlayerPresenter(problem, capabilities.navigatable?.next)
    const timer = useTimer()

    //const review = useLearningEventStore(s=>s.review)
    const handleAnswer = async (res: SolvedResult) => {
        capabilities.answerable?.answer?.(problem.id, res, timer.seconds)  // ミッションを進める
    }
    const navigate = useNavigate()
    const handleOpenDetailDialog = () => {
        //presenter.dialogs.detail.openDialog(problem.id)
        navigate(routes.detail(problem.id))
    }


    useEffect(() => {
        timer.reset()
        timer.start()  // TODO debug
    }, [problem.id])

    return (
        <AppShell
            header={ "Player"}
            footer={capabilities.answerable &&
                <PlayerAnswerActions onAnswerClick={handleAnswer} />}
            rightActions={
                <PlayerRightActions
                    problemId={problem.id}
                    onOpenDetailDialog={handleOpenDetailDialog}
                    onUndoLastAnswer={capabilities.answerable?.undoLastAnswer}
                />}
        >
            <PlayerView
                problem={problem}
                title={title}
                problemNavigation={capabilities.navigatable}
                timer={timer}
            />
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}