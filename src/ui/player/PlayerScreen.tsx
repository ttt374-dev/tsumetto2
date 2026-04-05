import React from "react"
import { Box, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PlyControlPanel from "@/ui/player/components/panels/PlyControlPanel";

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../layout/AppShell";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore, type GameEvent } from "./store/useGameStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useReplayStore } from "@/ui/player/store/useReplayStore";
import { usePlayerInitializer } from "@/ui/player/hooks/usePlayerInitializer";
import { useGameEventHandler, useRevealHandler } from "@/ui/player/hooks/useGameEventHandler";
import { usePromotionDialog } from "@/ui/player/hooks/usePromotionDialog";

///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onSolve, onSolvedConfirm, onAfterDelete, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    onSolve: () => void
    onSolvedConfirm: () => void
    onAfterDelete?: () => void
    footerPanel?: React.ReactNode
}) {
    const gameState = useGameStore(s=>s.state)            
    const replay = useReplayStore()        
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    
    
    //const { isInitialized } = usePlayerInitializer(problem)
    const {onRevealAnswer } = useRevealHandler()
    const { element: solveDialogElement } = useGameEventHandler(problem, onSolve, onSolvedConfirm)
    const { element: promotionDialogElement } = usePromotionDialog()

    const toast = useToast()
    const navigate = useNavigate()    

    // handlers
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }
    
    const handleDelete = (id: ProblemId) => {
        if (!window.confirm("sure to delete ? ")) return
        deleteProblem(id)
        onAfterDelete?.()
        toast({message: `deleted: ${id}`})
    }    
    
    ////////////////////////////////////////////////////////////////////////
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
                    <MovesPanel
                        problem={problem}
                        moves={problem.kifData.moves} isMovesVisible={gameState.isRevealed} />

                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <TimerControlPanel />

                        {gameState.isRevealed ?
                            <PlyControlPanel
                                currentPly={replay.ply}
                                maxPly={problem.kifData.moves.length}
                                onPrev={replay.retreatPly}
                                onNext={replay.advancePly}
                            /> : (<Stack>
                                <Button onClick={onRevealAnswer} variant="outlined">
                                    手筋を表示
                                </Button>
                            </Stack>)
                        }
                    </Box>
                </Stack>
            </Stack>

            { promotionDialogElement }            
            { solveDialogElement }
        </AppShell>
    )
}
