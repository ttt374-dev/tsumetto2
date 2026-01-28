import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useReplayController } from "../player/useReplayController";
import { KifData } from "@/domain/kif/types";
import PlayerView from "../player/components/PlayerView";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import { Problem, type ProblemId } from "@/domain/problem/Problem";
import { useShowMovesController } from "../player/PlayerScreen";
import { PlayerFooterActions } from "../player/components/PlayerFooterActions";
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";

export function useViewerDialog(){
    const [open, setOpen] = useState(false)
    const [problem, setProblem ] = useState<Problem|undefined>(undefined)
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const openDialog = (id: ProblemId) => {
        setProblem(problemStore.findById(id))
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
    

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle>{problem.title}</DialogTitle>
            <DialogContent>
                <PlayerView
                    moves={problem.kifData.moves}
                    position={replay.position}
                    retreatPly={replay.retreatPly}
                    advancePly={replay.advancePly}
                    onMoveToPly={replay.moveToPly}
                    currentPlyIndex={replay.plyIndex}

                    showMoves={showMovesController.showMoves}
                    setShowMoves={showMovesController.setShowMoves} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    戻る
                </Button>

            </DialogActions>
        </Dialog>)

}