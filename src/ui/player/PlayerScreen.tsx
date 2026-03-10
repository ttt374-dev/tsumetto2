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
import { useReplayStore } from "./hooks/useReplayStore";
import { useToast } from "../App/providers/ToastProvider";
import { useBoardInputStore } from "./hooks/useBoardInputStore";

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
    const mistakes = useReplayStore(s=>s.mistakes)
    const replayPhase = useReplayStore(s=>s.replayPhase)
    const plyIndex = useReplayStore(s=>s.plyIndex)
    const toast = useToast()

    //const review = useLearningEventStore(s=>s.review)
    const handleAnswer = async (res: SolvedResult) => {
        capabilities.answerable?.answer?.(problem.id, res, timer.seconds, mistakes)  // ミッションを進める
    }
    const navigate = useNavigate()
    
    const handleOpenDetailDialog = () => {
        //presenter.dialogs.detail.openDialog(problem.id)
        navigate(routes.detail(problem.id))
    }

    useEffect(() => {
        timer.reset()
        timer.start()
    }, [problem.id])

    useEffect(() => {
        if (replayPhase.type === "completed") {
            setTimeout(() => {
                if (window.confirm(`詰みです: 間違い回数：${replayPhase.result.mistakes}, ${replayPhase.result.answerShown}:次へ`)) {
                    handleAnswer({ ...replayPhase.result, elapsedSec: timer.seconds })
                }
            }, 100)
        }

    }, [plyIndex])
    useEffect(() => {
        if (mistakes > 0) toast({message: `incorrect: ${mistakes}`})
    }, [mistakes])    

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