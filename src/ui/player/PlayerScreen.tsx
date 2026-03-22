import React from "react"
import { Box, Drawer, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { PlayerRightPanel } from "./components/panels/PlayerRightPanel";
import { createSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore } from "./hooks/useGameStore";
import { useTimerStore } from "./hooks/useTimerStore";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";
import { PromotionDialog } from "./dialogs/PromotionDialog";
import { useBoardInputStore } from "./hooks/useBoardInputStore";
import { useShallow } from "zustand/react/shallow";

//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, onSolved, onUndoLastAnswer, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    onSolved?: (res: SolvedResult) => void
    onUndoLastAnswer?: () => void
    footerPanel?: React.ReactNode
    }) {
    const timer = useTimerStore()
    const toast = useToast()    
    const navigate = useNavigate()

    const { pendingPromotion, event, clearEvent, initialize, choosePromotion, } =
        useGameStore(useShallow(s => ({
            pendingPromotion: s.pendingPromotion,
            event: s.event,
            clearEvent: s.clearEvent,
            initialize: s.initialize,
            choosePromotion: s.choosePromotion
        })))
    const clearSelection = useBoardInputStore(s=>s.clear)

    useEffect(()=>{
        timer.restart()
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
    }, [problem.id])

    useEffect(() => {
        if (!event) return        
        switch (event.type) {
            case "SOLVED":
                const solvedResult = createSolvedResult(event.mistakes, event.isRevealed, timer.elapsedSec)
                onSolved?.(solvedResult)
                break
            case "MISTAKE":
                toast({ message: `incorrect: ${event.mistakes}` })
                break

            case "AUTO_ADVANCE_REQUESTED":
                setTimeout(() => {
                    const state = useGameStore.getState()
                    if (state.ply === event.expectedPly) {
                        state.advancePly()
                    }
                }, event.delayMs)
                break
        }   
        clearEvent()
    }, [event])    
    
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
            footer={footerPanel}
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
                open={pendingPromotion !== null}
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