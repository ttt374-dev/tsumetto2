import React from "react"
import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import { PlayerAnswerActions } from "./components/actions/PlayerAnswerActions"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { usePlayerPresenter } from "./hooks/usePlayerPresenter";
import { PlayerRightActions } from "./components/actions/PlayerRightActions";
import { createSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore } from "../game/useGameStore";
import { useTimerStore } from "../game/useTimerStore";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardView from "@/ui/game/BoardView"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";

function usePlayerViewModel(problem: Problem, onResolved?: (res: SolvedResult) => void) {
    const timer = useTimerStore()
    const { initialize, mistakes, revealed, resolved } = useGameStore()
    const [resolvedCalled, setResolvedCalled] = useState(false)

    useEffect(() => {
        timer.reset()
        timer.start()
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
        setResolvedCalled(false)
    }, [problem.id, initialize])

    useEffect(() => {
        if (resolved && !resolvedCalled) {
            const solvedResult = createSolvedResult(mistakes, revealed, timer.elapsedSec)
            onResolved?.(solvedResult)
            setResolvedCalled(true)
        }
    }, [resolved, resolvedCalled])
    return {
        mistakes, resolved, revealed,
        presenter: usePlayerPresenter(problem),
    }
}

//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, onResolved, onUndoLastAnswer }: {
    problem: Problem
    title: React.ReactNode
    onResolved?: (res: SolvedResult) => void
    onUndoLastAnswer?: () => void
}) {
    const toast = useToast()
    const { mistakes, resolved, revealed, presenter } = usePlayerViewModel(problem, onResolved)
    //const presenter = vm.presenter //  usePlayerPresenter(problem)    

    useEffect(() => {
        toast({ message: `詰みました: 間違い回数：${mistakes}, ${revealed ? "[答え参照]" : ""}:次へ` })
    }, [resolved])

    useEffect(() => {
        if (mistakes > 0) toast({ message: `incorrect: ${mistakes}` })
    }, [mistakes])

    const navigate = useNavigate()
    const handleOpenDetailDialog = () => {
        navigate(routes.detail(problem.id))
    }

    return (
        <AppShell
            header={"Player"}
            footer={<PlayerAnswerActions />}
            rightActions={
                <PlayerRightActions
                    problemId={problem.id}
                    onOpenDetailDialog={handleOpenDetailDialog}
                    onUndoLastAnswer={onUndoLastAnswer}
                />}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                { /* --- 盤面 ---*/}
                <BoardView />

                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                    { /* --- 手筋 ---*/}
                    <MovesPanel moves={problem.kifData.moves} />

                    { /* --- コントロールパネル ---*/}
                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <TimerControlPanel />
                        <ProblemLearningInfoPanel problem={problem} />
                    </Box>
                </Stack>
            </Stack>
            {presenter.rightActionsDrawer.drawerElement}
        </AppShell>
    )
}