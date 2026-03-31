import React, { useRef, useState }  from "react"
import { Box, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import PromotionDialog from "./dialogs/PromotionDialog";
import PlyControlPanel from "@/ui/player/components/panels/PlyControlPanel";

import type { IntentResult } from "@/domain/game/intentResolver";
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore, type GameEvent } from "./hooks/useGameStore";
import { useBoardInputStore } from "./hooks/useBoardInputStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { SolvedDialog } from "@/ui/player/dialogs/SolvedDialog";
import { useReplayStore } from "@/ui/player/hooks/useReplayStore";
import { useTimerStore } from "@/ui/player/hooks/useTimerStore";
import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/intentHandler";
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver";
import { isInteger } from "lodash";

//////////////////////////////////////////////////////////////
function usePlayerInitializer(problem: Problem){
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeGame = useGameStore(s=>s.initialize)
    const initializeReplay = useReplayStore(s=>s.initialize)
    const restart = useTimerStore(s=>s.restart)
    
    useEffect(()=>{                
        setIsInitialized(false)
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)      
        initializeReplay(problem.kifData.moves.length)
        restart()        
        setIsInitialized(true)
    }, [problem.id])

    return { isInitialized }
}
function useRevealHandler(){
    const { dispatch } = useGameStore()            
    const ctx = createPlayerContext()  
    
    const onRevealAnswer = () => {
        dispatch({type: "REVEAL", ...ctx})
    }
    return { onRevealAnswer }

}
function useGameEventHandler(isInitialized: boolean, onSolve?: () => void){
    const [isSolvedDialogOpen, setIsSolvedDialogOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult|undefined>(undefined)
    const events = useGameStore(s=>s.events)    
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)

    useEffect(() => {
        if (!isInitialized) return   // 初期化前は無視
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":        
                replay.advancePly()
                stopTimer()
                setIsSolvedDialogOpen(true)
                setSolvedResult(deriveSolvedResultFromEvents(events))
                onSolve?.()
                break            
            case "ADVANCE_TURN":
                advanceTurn()
                break;
        }
    }, [events])

    const turnIdRef = useRef(0)    
    const advanceTurn = () => {
        replay.advancePly()
        replay.startAnimation()
        const currentId = ++turnIdRef.current
        setTimeout(() => {
            if (currentId !== turnIdRef.current) return
            const replay = useReplayStore.getState()
            replay.advancePly()
            replay.endAnimation()
        }, 500)
    }
    return { isSolvedDialogOpen, setIsSolvedDialogOpen, solvedResult}
}
///////////////////////////////////////////
export default function PlayerScreen({ problem, title, onSolve, onSolvedConfirm, onAfterDelete, footerPanel }: {
    problem: Problem
    title: React.ReactNode
    onSolve?: () => void
    onSolvedConfirm: () => void
    onAfterDelete?: () => void
    footerPanel?: React.ReactNode
}) {    
    const toast = useToast()
    const navigate = useNavigate()    
    
    const {  state } = useGameStore()            
    const replay = useReplayStore()    
    
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    
    const { isInitialized } = usePlayerInitializer(problem)
    const {onRevealAnswer } = useRevealHandler()

    const { isSolvedDialogOpen, setIsSolvedDialogOpen, solvedResult } 
        = useGameEventHandler(isInitialized, onSolve)
    const { element: promotionDialogElement } = usePromotionDialog()
    
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
                        moves={problem.kifData.moves} isMovesVisible={state.isRevealed} />

                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <TimerControlPanel />

                        {state.isRevealed ?
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
            
            { solvedResult &&
            <SolvedDialog open={isSolvedDialogOpen}
                onClose={() => setIsSolvedDialogOpen(false)}
                onConfirm={onSolvedConfirm}
                solvedResult={solvedResult}
            />}
        </AppShell>
    )
}
function usePromotionDialog(){
    const { pendingPromotion } = useGameStore()        
    const { dispatch, choosePromotion } = useGameStore()    
    const clearSelection = useBoardInputStore(s=>s.clear)

    const onPromotionConfirm = (promote: boolean) => {
        const intentResult: IntentResult = { type: "move", move: choosePromotion(promote) }
        const ctx = createDecideGameEventContext()
        const decision = decideGameEvent({ intentResult, ...ctx })

        switch (decision.type) {
            case "invalidMove":
                return
            case "promotionPending":
                // ここに来たらバグ
                console.error("Unexpected promotionPending after confirm")
                return
            case "event":
                dispatch(decision.event)
                clearSelection()
                return
        }        
    }
    const element = pendingPromotion && 
            <PromotionDialog 
                open={pendingPromotion !== null}
                pieceType={pendingPromotion.pieceType}
                onConfirm={onPromotionConfirm}
                onClose={() => {}}
                >
                </PromotionDialog>
    
    return { element }
}