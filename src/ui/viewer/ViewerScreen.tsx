import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";
import { useExercise } from "@/application/useExercise";
import type { Exercise } from "@/domain/Exercise/Exercise";
import { Problem } from "@/domain/problem/Problem";
import BoardView from "../player/components/BoardView";
import { useReplayController } from "../player/useReplayController";
import { Box, Button, Stack } from "@mui/material";
import MovesView from "../player/components/MovesView";
import { PlayerView } from "../player/PlayerScreen";
import { KifData } from "@/domain/kif/types";

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