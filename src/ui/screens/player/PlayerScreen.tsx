import React from "react"
import { Box, Button, IconButton, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../../common/components/layout/AppShell";
import { routes } from "../../App/useAppNavigation";
import { useToast } from "../../App/providers/ToastProvider";
import { useGameStore, type GameEvent } from "./store/useGameStore";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import { useGameEventHandler, useRevealHandler } from "@/ui/screens/player/hooks/useGameEventHandler";
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import { reverse } from "lodash";

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
    const reversed = useGameStore(s=>s.displayReversed)    
    const userSide = useGameStore(s=>s.userSide)  
    const toggleReversed = useGameStore(s=>s.toggleReversed)
    const toggleUserSide = useGameStore(s=>s.toggleUserSide)
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
                <BoardPanel reversed={reversed}/>

                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                    <MovesPanel
                        problem={problem}
                        moves={problem.kifData.moves} isMovesVisible={gameState.isRevealed} />

                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <Stack direction="row" alignItems="center">
                            <TimerControlPanel />

                            <IconButton onClick={toggleReversed}>
                                <SwapVertIcon />
                            </IconButton>

                            <Box onClick={toggleUserSide}>
                                {userSide === "black" ? "▲" : "△"}
                            </Box>
                        </Stack>

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
