import React, { useCallback, useEffect } from "react"
import { Box, Button, getSwitchUtilityClass, IconButton, Stack } from "@mui/material"
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
import { usePromotionDialog } from "@/ui/screens/player/hooks/usePromotionDialog";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog, useSolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { createRectAdjustmentFn } from "@dnd-kit/core/dist/utilities/rect/rectAdjustment";

function usePlayerScreenViewModel(){
        // reveal
    const createRevealEvent = (): GameEvent => {
        const ctx = createPlayerContext()      
        return {type: "REVEAL", ...ctx}
    }   

    return { createRevealEvent}

}
///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onUIEvent, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    //onSolve: () => void
    onUIEvent?: (uiEvent: GameUIEvent) => void    
    footerPanel?: React.ReactNode
}) {
    const gameState = useGameStore(s=>s.state)       
    const reversed = useGameStore(s=>s.displayReversed)    
    const userSide = useGameStore(s=>s.userSide)  
    const dispatch = useGameStore(s=>s.dispatch)
    const toggleReversed = useGameStore(s=>s.toggleReversed)
    const toggleUserSide = useGameStore(s=>s.toggleUserSide)
    const replay = useReplayStore()
    const solvedResultDialog = useSolvedDialog()    
    const promotionDialog = usePromotionDialog()    

    const toast = useToast()
    const navigate = useNavigate()
    const vm = usePlayerScreenViewModel()

    ////////////////
    // handlers    
    const handleUIEvent = useCallback((uiEvent: GameUIEvent) => {
        switch(uiEvent.type){
            case "solved":                
                solvedResultDialog.openDialog(problem.id, uiEvent.solvedResult)
                break
            case "mistake":
                toast({ message: `mistake: ${uiEvent.count}` })
                break
            case "solvedConfirmed":
                // Playerでは何もしない（親に委譲）
                break
        }
         // ⭐ 外にも流す
        onUIEvent?.(uiEvent)
    }, [problem.id, toast, onUIEvent, solvedResultDialog])

    useGameEventHandler(problem, handleUIEvent)
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }    
    // delete
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    
    const handleDelete = (id: ProblemId) => {
        if (!window.confirm("sure to delete ? ")) return
        deleteProblem(id)
        toast({message: `deleted: ${id}`})
    }
    
    // solvedconfirm
    const handleSolvedConfirm = () => {
        onUIEvent?.({type: "solvedConfirmed"})
        solvedResultDialog.closeDialog()
    }
    const records = useLearningRecordStore(s=>s.stateRecords)
    const learningState = records[problem.id]
    //const learningState = solvedResultDialog.open ? records[solvedResultDialog.problemId] : undefined

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
                                <Button onClick={()=>dispatch(vm.createRevealEvent())} variant="outlined">
                                    手筋を表示
                                </Button>
                            </Stack>)
                        }
                    </Box>
                </Stack>
            </Stack>

            {promotionDialog.open &&
                <PromotionDialog
                    open={promotionDialog.open}
                    pieceType={promotionDialog.pieceType}
                    onConfirm={promotionDialog.onConfirm}
                />}

            {solvedResultDialog.open &&
                <SolvedDialog
                    open={solvedResultDialog.open}
                    onClose={solvedResultDialog.closeDialog}
                    solvedResult={solvedResultDialog.solvedResult}
                    learningState={learningState}
                    onConfirm={handleSolvedConfirm}
                />}
        </AppShell>
    )
}
