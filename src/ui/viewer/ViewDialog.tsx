import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

import { useReplayController } from "@/ui/player/hooks/useReplayController";
import PlayerView, { type PlayerViewHandlers } from "@/ui/player/components/PlayerView";
import { useProblemStore } from "@/application/store/useProblemStore";
import { Problem, type ProblemId } from "@/domain/problem/Problem";
import { useShowMovesController } from "../player/hooks/usePlayerViewModel";

export function useViewerDialog(){
    const [open, setOpen] = useState(false)
    const [problem, setProblem ] = useState<Problem|undefined>(undefined)
    
    //const problemStore = useProblemStore(repos.problem)

    const openDialog = (id: ProblemId) => {
        //setProblem(problemStore.findById(id))
        //const p = useProblemStore(s=>s.byId[id])
        const p = useProblemStore.getState().byId[id]
        setProblem(p)
        setOpen(true)
    }

    const dialogElement = (
        problem && <ViewerDialog problem={problem} open={open} onClose={()=>{setOpen(false)}}/>
    )
    return { openDialog, dialogElement}
}
export function ViewerDialog({ problem, open, onClose }: { 
    problem: Problem 
    open: boolean,
    onClose: () => void
}) {
    const { initialPosition, moves } = problem.kifData
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)
    
    const handlers:  PlayerViewHandlers = {
         ply: {
            advance: replay.advancePly,
            retreat: replay.retreatPly,
            moveTo: replay.moveToPly
        },
        setShowMoves: showMovesController.setShowMoves,
        navigation: { next: alert, prev: alert, moveTo: alert, }
    }
    return (
        <Dialog open={open} onClose={onClose} 
            sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        fullScreen>
            <DialogTitle>{problem.title}</DialogTitle>
            <DialogContent>
                <PlayerView
                    moves={problem.kifData.moves}
                    position={replay.position}
                    currentPlyIndex={replay.plyIndex}
                    //showMoves={showMovesController.showMoves}
                    showMoves={true}
                    tags={problem.tags}
                    handlers={handlers}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    戻る
                </Button>

            </DialogActions>
        </Dialog>
    )

}