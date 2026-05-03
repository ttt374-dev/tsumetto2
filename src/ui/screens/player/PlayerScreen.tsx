import React, { useCallback, useEffect } from "react"
import { Box, Button, IconButton, Stack } from "@mui/material"
import SwapVertIcon from '@mui/icons-material/SwapVert';

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/moves/MovesPanel";
import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";

import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "../../common/components/layout/AppShell";
import { useGameStore } from "./store/useGameStore";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { usePlayerViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";
import { useGameInitializer } from "@/ui/screens/player/hooks/useGameInitializer";


///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onUIEvent, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    onUIEvent?: (uiEvent: GameUIEvent) => void    
    footerPanel?: React.ReactNode
}) {
    // store
    const gameState = useGameStore(s=>s.state)       
    const reversed = useGameStore(s=>s.displayReversed)   
    const replay = useReplayStore()
    const records = useLearningRecordStore(s=>s.stateRecords)
    const learningState = records[problem.id]

    // view model
    const vm = usePlayerViewModel(problem)

    ////////////////
    // UI Event
    const handleUIEvent = (uiEvent: GameUIEvent) => {
        vm.handleUIEvent(uiEvent)
        onUIEvent?.(uiEvent)
    }
    const handleConfirmSolved = () => {
        handleUIEvent({type: "solvedConfirmed"})
    }   

    // 初期化    
    const isIntialized = useGameInitializer(problem)   
    useGameEventHandler(handleUIEvent, isIntialized)

    // 消された場合
    if (problem.deletedAt) {
        return <AppShell footer={footerPanel}>Deleted: {problem.title}</AppShell>
    }

    ////////////////////////////////////////////////////////////////////////
    return (
        <AppShell
            header={"Player"}
            footer={footerPanel}
            rightActions={
                <PlayerRightPanel
                    problemId={problem.id}
                    onNavigateToDetail={vm.actions.navigateToDetail}
                    onDelete={vm.actions.deleteProblem}
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
                            <ReverseControl/>
                            <UserSideControl/>
                        </Stack>

                        {gameState.isRevealed ?
                            <PlyControlPanel
                                currentPly={replay.ply}
                                maxPly={problem.kifData.moves.length}
                                onPrev={replay.retreatPly}
                                onNext={replay.advancePly}
                            /> : (<Stack>
                                <Button onClick={vm.actions.dispatchReveal} variant="outlined">
                                    手筋を表示
                                </Button>
                            </Stack>)
                        }
                    </Box>
                </Stack>
            </Stack>

            {vm.dialogs.promotion.open &&
                <PromotionDialog
                    open={vm.dialogs.promotion.open}
                    onConfirm={vm.dialogs.promotion.onConfirm}
                    pieceType={vm.dialogs.promotion.pieceType}
                />}

            {vm.dialogs.solvedResult.open &&
                <SolvedDialog
                    open={vm.dialogs.solvedResult.open}
                    onClose={vm.dialogs.solvedResult.closeDialog}
                    onConfirm={handleConfirmSolved}
                    solvedResult={vm.dialogs.solvedResult.solvedResult}
                    learningState={learningState}

                />}
        </AppShell>
    )
}
function ReverseControl(){    
    const toggleReversed = useGameStore(s=>s.toggleReversed)
    return (
        <IconButton onClick={toggleReversed}>
            <SwapVertIcon />
        </IconButton>
    )
}
function UserSideControl(){
    const userSide = useGameStore(s=>s.userSide)  
    const toggleUserSide = useGameStore(s=>s.toggleUserSide)
    return (
        <Box onClick={toggleUserSide}>
            {userSide === "black" ? "▲" : "△"}
        </Box>
    )
}