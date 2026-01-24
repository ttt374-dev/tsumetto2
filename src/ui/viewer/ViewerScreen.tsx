import { useNavigate, useParams } from "react-router-dom";
//import { useExerciseControl } from "@/application/useExerciseControl";
import { useReplayController } from "../player/useReplayController";
import { KifData } from "@/domain/kif/types";
import PlayerView from "../player/components/PlayerView";
import { createProblemStore } from "@/application/store/useProblemStore";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import type { Problem } from "@/domain/problem/Problem";

export function ViewerScreen() {
    const { id } = useParams()
    if (!id) return null
    //const exerciseController = useExerciseControl()
    //const exercise = id ? exerciseController.find(id) : null
    const repos = useRepositoryContext()
    const problemStore = createProblemStore(repos.problem)
    const problem = problemStore.problems.find(p => p.id === id)
    if (!problem) return null
    const replay = useReplayController(problem?.kifData ?? KifData.create())    

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