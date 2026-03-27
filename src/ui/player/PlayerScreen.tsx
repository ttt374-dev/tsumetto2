import React  from "react"
import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { PlayerRightPanel } from "./components/panels/PlayerRightPanel";
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
import { useProblemStore } from "@/ui/store/useProblemStore";
import type { Intent } from "@/domain/game/intentResolver";
import { createGameController } from "@/ui/player/hooks/createGameController";

//////////////////////////////////////////////////////////////
export default function PlayerScreen({ problem, title, onSolved, onAfterDelete, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    onSolved?: () => void
    onAfterDelete?: () => void
    footerPanel?: React.ReactNode
}) {
    const timer = useTimerStore()
    const toast = useToast()
    const navigate = useNavigate()

    const { pendingPromotion, state, events } = useGameStore()
    const controller = createGameController()
    const clearSelection = useBoardInputStore(s=>s.clear)
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    

    useEffect(()=>{        
        controller.start(problem)
    }, [problem.id])
      
    useEffect(() => {
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":
                onSolved?.()
                break
            case "MISTAKE":
                toast({ message: `incorrect: [${state.mistakes}]` })
                break
        }
    }, [events])
    
    // handlers
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }
    const handlePromotionConfirm = (promote: boolean) => {
        const intent: Intent = {
            type: "choosePromotion",
            promote
        }
        //choosePromotion(promote)
        console.log("elasped sec on handle promotion confirm", timer.elapsedSec)
        controller.handleIntent(intent, timer.elapsedSec)
        clearSelection()
    }
    const handleDelete = (id: ProblemId) => {
        if (!window.confirm("sure to delete ? ")) return
        deleteProblem(id)
        onAfterDelete?.()
        toast({message: `deleted: ${id}`})
    }

    return (
        <AppShell
            header={"Player"}
            footer={footerPanel}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onNavigateToDetail={handleNavigateToDetail}
                    onDelete={handleDelete}
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