import React, { useState }  from "react"
import { Box, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";
import PromotionDialog from "./dialogs/PromotionDialog";
import PlyControlPanel from "@/ui/player/components/panels/PlyControlPanel";

import type { IntentResult } from "@/domain/game/intentResolver";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useCurrentPosition, useGameStore } from "./hooks/useGameStore";
import { useBoardInputStore } from "./hooks/useBoardInputStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver";
import { SolvedDialog } from "@/ui/player/dialogs/SolvedDialog";
import { useReplayStore } from "@/ui/player/hooks/useReplayStore";
import { useTimerStore } from "@/ui/player/hooks/useTimerStore";
import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/intentHandler";
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext";

//////////////////////////////////////////////////////////////
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
    const { initialize, dispatch, choosePromotion, pendingPromotion, state, events, moves } = useGameStore()        
    
    const replay = useReplayStore()
    const timer = useTimerStore()
    const clearSelection = useBoardInputStore(s=>s.clear)
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    

    const [isSolvedDialogOpen, setIsSolvedDialogOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)
    const [isInitialized, setIsInitialized] = useState(false)
    
    useEffect(()=>{        
        setIsInitialized(false)
        initialize(problem.kifData.initialPosition, problem.kifData.moves)
        console.log("initialized", events)
        
        replay.initialize(problem.kifData.moves.length)
        timer.restart()        
        setIsInitialized(true)
    }, [problem.id])
      
    let turnId = 0

    useEffect(() => {
        if (!isInitialized) return   // 初期化前は無視
        console.log("switching", events)
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":
        
                replay.advancePly()
                timer.stop()
                setIsSolvedDialogOpen(true)
                setSolvedResult(deriveSolvedResultFromEvents(events))                
                onSolve?.()
                break
            case "MISTAKE":
                toast({ message: `incorrect: [${state.mistakes}]` })
                break

            case "ADVANCE_TURN":
                advanceTurn()
                break;                

        }
    }, [events])

    const advanceTurn = () => {
        replay.advancePly()
        replay.startAnimation()
        const currentId = ++turnId
        setTimeout(() => {
            if (currentId !== turnId) return
            const replay = useReplayStore.getState()
            replay.advancePly()
            //console.log("adva turn", currentId, turnId)
            replay.endAnimation()
        }, 500)
    }
    // handlers
    const handleNavigateToDetail = () => {
        navigate(routes.detail(problem.id))
    }
    const handlePromotionConfirm = (promote: boolean) => {
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
    const handleDelete = (id: ProblemId) => {
        if (!window.confirm("sure to delete ? ")) return
        deleteProblem(id)
        onAfterDelete?.()
        toast({message: `deleted: ${id}`})
    }
    const ctx = createPlayerContext()
    const handleRevealAnswer = () => {
        dispatch({type: "REVEAL", ...ctx})
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
                        moves={problem.kifData.moves} isMovesVisible={state.isRevealed}/>
                    
                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <TimerControlPanel />
                        
                        {state.isRevealed ?
                            <PlyControlPanel
                                currentPly={replay.ply}
                                maxPly={problem.kifData.moves.length}
                                onPrev={replay.retreatPly}
                                onNext={replay.advancePly}                                
                            />: (<Stack>
                    <Button onClick={handleRevealAnswer} variant="outlined">
                        手筋を表示
                    </Button>
                    
                    
                </Stack>)
                        }
                    </Box>
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

            { solvedResult &&
                <SolvedDialog open={isSolvedDialogOpen}
                    onClose={() => setIsSolvedDialogOpen(false)}
                    onConfirm={onSolvedConfirm}
                    solvedResult={solvedResult}
                />}
        </AppShell>
    )
}
