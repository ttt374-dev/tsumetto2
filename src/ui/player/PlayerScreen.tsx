import { PlayerAnswerActions } from "./components/actions/PlayerAnswerActions"
import PlayerView from "./components/PlayerView"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { useTimer } from './hooks/useTimer';
import { useEffect, useState } from 'react';
import { PlayerRightActions } from "./components/actions/PlayerRightActions";
import { createSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { selectIsLast, useGameStore } from "../game/useGameStore";

export type ProblemNavigation = {
    next: () => void,
    prev: () => void,
}

//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, submitAnswer, undoLastAnswer }: {
    problem: Problem
    title: React.ReactNode
    //capabilities: PlayerCapabilities
    submitAnswer?: (id: ProblemId, res: SolvedResult) => void
    undoLastAnswer?: () => void
}) {
    const presenter = usePlayerPresenter(problem)
    const timer = useTimer()
    //const isLast = useGameStore(selectIsLast)
    const initialize = useGameStore(s=>s.initialize)
    const { mistakes, revealed, resolved } = useGameStore()
    const toast = useToast()
    const [answerSubmitted, setAnswerSubmitted] = useState(false)

    const handleAnswer = async () => {
        const solvedResult = createSolvedResult(mistakes, revealed, timer.seconds)
        submitAnswer?.(problem.id, solvedResult)
        setAnswerSubmitted(true)
        console.log("answersubmited", answerSubmitted)
    }
    const navigate = useNavigate()
    
    const handleOpenDetailDialog = () => {
        //presenter.dialogs.detail.openDialog(problem.id)
        navigate(routes.detail(problem.id))
    }

    useEffect(() => {
        timer.reset()
        timer.start()
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
    }, [problem.id])

    useEffect(() => {
        if (resolved && !answerSubmitted) {
            setTimeout(() => {
                if (window.confirm(`詰みました: 間違い回数：${mistakes}, ${revealed ? "[答え参照]" : ""}:次へ`)) {
                    handleAnswer()
                }
            }, 100)
        }

    }, [resolved, answerSubmitted])

    useEffect(() => {
        if (mistakes > 0) toast({message: `incorrect: ${mistakes}`})
    }, [mistakes])    

    return (
        <AppShell
            header={ "Player"}
            footer={<PlayerAnswerActions />}
            rightActions={
                <PlayerRightActions
                    problemId={problem.id}
                    onOpenDetailDialog={handleOpenDetailDialog}
                    onUndoLastAnswer={undoLastAnswer}
                />}
        >
            <PlayerView
                problem={problem}
                title={title}
                timer={timer}
            />
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}