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
import { selectGameState, useCurrentPosition, useGameStore } from "./hooks/useGameStore";
import { useTimerStore } from "./hooks/useTimerStore";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";
import { PromotionDialog } from "./dialogs/PromotionDialog";


function usePlayerViewModel(problem: Problem, onResolved?: (res: SolvedResult) => void) {
    const timer = useTimerStore()
    const { initialize, mistakes, revealed, resolved, reset, pendingPromotion: promotionMove, applyIntent } = useGameStore()
    const [onResolvedCalled, setOnResolvedCalled] = useState(false)

    useEffect(() => {
        reset()
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
        mistakes, resolved, revealed, promotionMove, applyIntent
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
    usePlayerViewModel(problem, onResolved)
    
    const { mistakes, applyIntent } = useGameStore()
    //const selection = useBoardInputStore(s=>s.selection)
    const choosePromotion = useGameStore(s=>s.choosePromotion)
    const pendingPromotion = useGameStore(s=>s.pendingPromotion)
    //const position = useCurrentPosition()    
    

    useEffect(() => {
        if (mistakes > 0) toast({ message: `incorrect: ${mistakes}` })
    }, [mistakes])

    const navigate = useNavigate()
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }
    const handleConfirm = (promote: boolean) => {
        //const intent: Intent = { type: "choosePromotion", promote }
        choosePromotion(promote)
        //console.log("choose promotion intent", intent)
        //applyIntent(intent)
    }
    
    return (
        <AppShell
            header={"Player"}
            footer={<PlayerFooterPanel />}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onNavigateToDetail={handleNavigateToDetail}
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

            { pendingPromotion && 
            <PromotionDialog 
                open={pendingPromotion !== undefined}
                pieceType={pendingPromotion.pieceType}
                onConfirm={handleConfirm}
                onClose={() => {}}
                >
            </PromotionDialog>}
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