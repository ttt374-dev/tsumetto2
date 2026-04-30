import React, { useCallback, useEffect } from "react"
import { Box, Button, IconButton, Stack } from "@mui/material"
import SwapVertIcon from '@mui/icons-material/SwapVert';

import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";

import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "../../common/components/layout/AppShell";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog";
import { useGameEventHandler, type GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { usePlayerViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";
import TitlePanel from "@/ui/screens/player/components/panels/TitlePanel";
import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";
import MovesPanel from "@/ui/screens/player/components/panels/moves/MovesPanel";
import { useParams } from "react-router-dom";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";

export default function ViewScreen(){
    const { id } = useParams<{ id: string }>()    
    if (!id) return <div>id not specified</div>

    const byId = useProblemStore(s=>s.byId)
    const problem = byId[id]
    if (!problem) return <div>no problem available</div>
    return <ViewContent problem={problem}/>
}
function ViewContent({ problem}: { problem: Problem}){
    const vm = usePlayerViewModel(problem)
    const replay = useReplayStore()

    useGameEventHandler(problem)
    
    const title = problem.title
    return (
            <AppShell
                header={"Player"}
            >
                <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} > 
                    <TitlePanel title={title} />
                    { /* --- 盤面 ---*/}
                    <BoardPanel/>
    
                    <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                        <MovesPanel
                            problem={problem}
                            moves={problem.kifData.moves} />
    
                        <Box sx={{ flex: 1, border: 1, borderColor: "divider" }}>                            
                                <PlyControlPanel
                                    currentPly={replay.ply}
                                    maxPly={problem.kifData.moves.length}
                                    onPrev={replay.retreatPly}
                                    onNext={replay.advancePly}
                                /> 
                                
                        </Box>
                    </Stack>
                </Stack>
    
                {vm.dialogs.promotion.open &&
                    <PromotionDialog
                        open={vm.dialogs.promotion.open}
                        onConfirm={vm.dialogs.promotion.onConfirm}
                        pieceType={vm.dialogs.promotion.pieceType}
                    />}
    
                
            </AppShell>
        )
}
