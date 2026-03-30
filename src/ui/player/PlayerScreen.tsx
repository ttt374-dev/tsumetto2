import React, { useState }  from "react"
import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "../common/components/layout/AppShell";
import { routes } from "../App/useAppNavigation";
import { useToast } from "../App/providers/ToastProvider";
import { useGameStore } from "./hooks/useGameStore";
import { useBoardInputStore } from "./hooks/useBoardInputStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import type { Intent } from "@/domain/game/intentResolver";
import { createGameController } from "@/ui/player/hooks/createGameController";
import type { SolvedResult } from "@/domain/review/solvedResult";
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver";
import { SolvedDialog } from "@/ui/player/dialogs/SolvedDialog";
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext";
import { useReplayStore } from "@/ui/player/hooks/useReplayStore";

import PlayerRightPanel from "./components/panels/PlayerRightPanel";
import TitlePanel from "./components/panels/TitlePanel";
import MovesPanel from "./components/panels/MovesPanel";
import BoardPanel from "@/ui/player/components/panels/board/BoardPanel"
import TimerControlPanel from "./components/panels/TImerControlPanel";
import ProblemLearningInfoPanel from "./components/panels/ProblemLearningInfoPanel";
import PromotionDialog from "./dialogs/PromotionDialog";
import PlyControlPanel from "@/ui/player/components/panels/PlyControlPanel";

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

    const { pendingPromotion, state, events } = useGameStore()
    const controller = createGameController()
    const replay = useReplayStore()
    const clearSelection = useBoardInputStore(s=>s.clear)
    const deleteProblem = useProblemStore(s=>s.deleteProblem)    

    const [isSolvedDialogOpen, setIsSolvedDialogOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)


    useEffect(()=>{        
        controller.start(problem)
        setIsSolvedDialogOpen(false)
    }, [problem.id])
      
    useEffect(() => {
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":
                setIsSolvedDialogOpen(true)
                setSolvedResult(deriveSolvedResultFromEvents(events))
                onSolve?.()
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
        controller.handleIntent(intent, createPlayerContext())
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
                    <MovesPanel moves={problem.kifData.moves} isMovesVisible={state.isRevealed}/>
                    
                    <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>
                        <TimerControlPanel />
                        <ProblemLearningInfoPanel problem={problem} />
                        {state.isRevealed &&
                            <PlyControlPanel
                                currentPly={replay.ply}
                                maxPly={problem.kifData.moves.length}
                                onPrev={replay.retreatPly}
                                onNext={replay.advancePly}
                            />
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
