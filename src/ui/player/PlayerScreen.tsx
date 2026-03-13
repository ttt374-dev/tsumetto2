import React from "react"
import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import { PlayerFooterPanel } from "./components/panels/PlayerFooterPanel"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { PlayerRightPanel } from "./components/panels/PlayerRightPanel";
import { createSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore } from "../game/hooks/useGameStore";
import { useTimerStore } from "../game/hooks/useTimerStore";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/game/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";

function usePlayerViewModel(problem: Problem, onResolved?: (res: SolvedResult) => void) {
    const timer = useTimerStore()
    const { initialize, mistakes, revealed, resolved } = useGameStore()
    const [onResolvedCalled, setOnResolvedCalled] = useState(false)

    useEffect(() => {
        timer.reset()
        timer.start()
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
        setOnResolvedCalled(false)
    }, [problem.id, initialize])

    useEffect(() => {
        if (resolved && !onResolvedCalled) {
            const solvedResult = createSolvedResult(mistakes, revealed, timer.elapsedSec)
            onResolved?.(solvedResult)
            setOnResolvedCalled(true)
        }
    }, [resolved, onResolvedCalled])
    return {
        mistakes, resolved, revealed,
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
    const { mistakes } = usePlayerViewModel(problem, onResolved)

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
            footer={<PlayerFooterPanel />}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onOpenDetailDialog={handleOpenDetailDialog}
                    onUndoLastAnswer={onUndoLastAnswer}
                />}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <TitlePanel title={title} />
                { /* --- 盤面 ---*/}
                <BoardPanel />

                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                    <MovesPanel moves={problem.kifData.moves} />
                    <PlayerControlPanel problem={problem} />
                </Stack>
            </Stack>
        </AppShell>
    )
}
export function PlayerControlPanel({ problem }: { problem: Problem }) {
    return (
        <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
            <TimerControlPanel />
            <ProblemLearningInfoPanel problem={problem} />
        </Box>
    )
}