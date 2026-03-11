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
import { selectIsLast, useReplayStore } from "./hooks/useReplayStore";
import { useToast } from "../App/providers/ToastProvider";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
}

type AnswerCapability = {
    answer: (problemId: ProblemId, res: SolvedResult, sec: number, mistakes: number) => void
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
    //const mistakes = useReplayStore(s=>s.mistakes)
    const solvedResult = useReplayStore(s=>s.solvedResult)
    const isLast = useReplayStore(selectIsLast)
    const plyIndex = useReplayStore(s=>s.plyIndex)
    const load = useReplayStore(s=>s.load)
    const toast = useToast()

    const handleAnswer = async (res: SolvedResult) => {
        capabilities.answerable?.answer?.(problem.id, res, timer.seconds, solvedResult.mistakes)  // ミッションを進める
    }
    const navigate = useNavigate()
    
    const handleOpenDetailDialog = () => {
        //presenter.dialogs.detail.openDialog(problem.id)
        navigate(routes.detail(problem.id))
    }

    useEffect(() => {
        timer.reset()
        timer.start()
        load(problem)
    }, [problem.id])

    useEffect(() => {
        if (isLast) {
            setTimeout(() => {
                if (window.confirm(`詰みました: 間違い回数：${solvedResult.mistakes}, ${solvedResult.revealed && "[答え参照]"}:次へ`)) {
                    handleAnswer({ ...solvedResult, elapsedSec: timer.seconds })
                }
            }, 100)
        }

    }, [plyIndex])

    useEffect(() => {
        if (solvedResult.mistakes > 0) toast({message: `incorrect: ${solvedResult.mistakes}`})
    }, [solvedResult.mistakes])    

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