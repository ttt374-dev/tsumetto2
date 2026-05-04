import { Box, Button, IconButton, Stack } from "@mui/material"

import BoardPanel from "@/ui/screens/player/components/panels/board/BoardPanel"
import PlyControlPanel from "@/ui/screens/player/components/panels/PlyControlPanel";

import { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog";
import TitlePanel from "@/ui/screens/player/components/panels/TitlePanel";
import MovesPanel from "@/ui/screens/player/components/panels/moves/MovesPanel";
import { useNavigate, useParams } from "react-router-dom";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import { usePlayerRunner } from "@/ui/screens/player/runner/usePlayerRunner";

export default function ViewScreen(){
    const { id } = useParams<{ id: string }>()    
    if (!id) return <div>id not specified</div>

    const byId = useProblemStore(s=>s.byId)
    const problem = byId[id]
    if (!problem) return <div>no problem available</div>
    return <ViewContent problem={problem}/>
}
function ViewContent({ problem}: { problem: Problem}){
    const model = usePlayerRunner(problem)
    const replay = useReplayStore()
    
    const title = problem.title
    return (
            <AppShell
                header={"Player"}
                footer={<FooterPanel/>}
            >
                <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} > 
                    <TitlePanel title={title} />
                    { /* --- 盤面 ---*/}
                    <BoardPanel boardModel={model.state.board}/>
    
                    <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                        <MovesPanel
                            problem={problem}
                            movesModel={model.state.moves}
                            onMoveToPly={model.actions.moves.moveToPly} />
    
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
    
                {model.ui.dialogs.promotion.open &&
                    <PromotionDialog
                        open={model.ui.dialogs.promotion.open}
                        onConfirm={model.ui.dialogs.promotion.onConfirm}
                        pieceType={model.ui.dialogs.promotion.pieceType}
                    />}
    
                
            </AppShell>
        )
}
function FooterPanel(){
    const navigate = useNavigate()
    return <>
        <Button onClick={()=> navigate(routes.back)}>
            戻る
        </Button>
    </>
}