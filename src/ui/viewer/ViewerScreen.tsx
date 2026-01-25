import { useNavigate, useParams } from "react-router-dom";
import { useReplayController } from "../player/useReplayController";
import { KifData } from "@/domain/kif/types";
import PlayerView from "../player/components/PlayerView";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";

export function ViewerScreen() {
    const { id } = useParams()    
    
    const repos = useRepositoryContext()    
    const problem = id ? useProblemStore(repos.problem).findById(id) : undefined    
    const { initialPosition, moves } = problem?.kifData ?? KifData.create()
    const replay = useReplayController(initialPosition, moves)

    if (!id || !problem) return null
    return (
        <PlayerView
            title={problem?.title}
            moves={problem?.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            currentPlyIndex={replay.plyIndex}
            showMoves={true}
            setShowMoves={()=>{}}
        />
    )

}