import { useNavigate, useParams } from "react-router-dom";
import { useReplayController } from "../player/useReplayController";
import { KifData } from "@/domain/kif/types";
import PlayerView from "../player/components/PlayerView";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import { Problem } from "@/domain/problem/Problem";
import { useShowMovesController } from "../player/PlayerScreen";
import { PlayerFooterActions } from "../player/components/PlayerFooterActions";
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { Button } from "@mui/material";

export function ViewerScreen() {
    const { id } = useParams()    
    
    const repos = useRepositoryContext()    
    const problem = id ? useProblemStore(repos.problem).findById(id) : undefined    
    if (!problem) return null
    return (<ViewerView problem={problem}/>)

}
export function ViewerView({problem}: { problem: Problem}){
    const { initialPosition, moves } = problem.kifData ?? KifData.create()
    const replay = useReplayController(initialPosition, moves)
    const showMovesController = useShowMovesController(problem.id, replay.plyIndex)
    // dialog
    const detailDialog = useProblemDetailDialog(problem)
    //
    const repos = useRepositoryContext()
    const learningEventStore = useLearningEventStore(repos.learningEvent)

    if (!problem) return null

    const navigate = useNavigate()

    const answer = async (solvedResult: SolvedResult, secToTaken?: number) => {
        await learningEventStore.append({
            type: "reviewed",
            problemId: problem.id,
            quality: solvedResult,
            sec: secToTaken,
        })
        navigate(-1)
    }
    
    return (
        <>
        <PlayerView
            title={problem.title}
            moves={problem.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            onOpenDetailDialog={detailDialog?.openDialog}
            currentPlyIndex={replay.plyIndex}            

            showMoves={showMovesController.showMoves}
            setShowMoves={showMovesController.setShowMoves}

                footerActions={
                    <Button onClick={()=>navigate(-1)}>
                        戻る
                    </Button>
                }
        />
        { detailDialog?.dialogElement}
        </>
    )

}