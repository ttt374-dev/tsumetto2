import { useNavigate, useParams } from "react-router-dom";
import { useExercise } from "@/application/useExercise";
import { useReplayController } from "../player/useReplayController";
import { KifData } from "@/domain/kif/types";
import { PlayerView } from "../player/components/PlayerView";

export function ViewerScreen() {
    const { id } = useParams()
    const exerciseController = useExercise()
    const exercise = id ? exerciseController.find(id) : null
    const replay = useReplayController(exercise?.problem.kifData ?? KifData.create())
    if (!id || !exercise) return null       

    return (
        <PlayerView
            title={exercise.problem.title}
            moves={exercise.problem.kifData.moves}
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