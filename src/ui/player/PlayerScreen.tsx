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
import { useBoardInputStore } from "./hooks/useBoardInputStore";


//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, onSolved, onUndoLastAnswer }: {
    problem: Problem
    title: React.ReactNode
    onSolved?: (res: SolvedResult) => void
    onUndoLastAnswer?: () => void
}) {
    const timer = useTimerStore()
    const toast = useToast()    
    const navigate = useNavigate()

    
    const { pendingPromotion, mistakes, isSolved, isRevealed, hasFiredOnSolved,
        events, clearEvents,
        initialize,  choosePromotion, } = useGameStore()
    const clearSelection = useBoardInputStore(s=>s.clear)
    

    useEffect(()=>{
        timer.restart()
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
    }, [problem.id])


    useEffect(() => {
        events.forEach(e => {
            if (e.type === "SOLVED" && onSolved) {
                const solvedResult = createSolvedResult(mistakes, isRevealed, timer.elapsedSec)
                onSolved(solvedResult)
            }
        })

        if (events.length > 0) {
            clearEvents()
        }
    }, [events])


    useEffect(() => {
        if (mistakes > 0) toast({ message: `incorrect: ${mistakes}` })
    }, [mistakes])
    
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }
    const handlePromotionConfirm = (promote: boolean) => {
        choosePromotion(promote)
        clearSelection()
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
                onConfirm={handlePromotionConfirm}
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