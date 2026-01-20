import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";
import { useExercise } from "@/application/useExercise";
import type { Exercise } from "@/domain/Exercise/Exercise";
import { Problem } from "@/domain/problem/Problem";
import BoardView from "../player/components/BoardView";
import { useReplayController } from "../player/useReplayController";
import { Box, Button, Stack } from "@mui/material";
import MovesView from "../player/components/MovesView";

export function ViewSCreen() {
    const { id } = useParams()
    const exerciseController = useExercise()

    if (!id) return null
    const exercise = exerciseController.find(id)
    if (!exercise) return null
    return (
        <ViewContent exercise={exercise} />
    )

}

///////
function ViewContent({ exercise }: { exercise: Exercise }) {
    const navigate = useNavigate()
    const replayController = useReplayController(exercise.problem.kifData)
    const moves = exercise.problem.kifData.moves
    
    return (
        <AppLayout 
            header={exercise.problem.title}
            footer={
            <Button fullWidth variant="outlined" onClick={() => { navigate(-1)}}>
                Back
            </Button>
        }
        >
            <Stack justifyContent="center">
                <Box>
                    <BoardView position={replayController.position} />
                </Box>
                <Stack direction="row" justifyContent="center">
                    <Button onClick={replayController.retreatPly} disabled={replayController.plyIndex === 0}>
                        Ret Ply
                    </Button>
                    <Button onClick={replayController.advancePly} disabled={replayController.plyIndex === exercise.problem.kifData.moves.length}>
                        Adv Ply
                    </Button>                    
                </Stack>

                <Box>
                    <MovesView moves={moves} currentPlyIndex={0} onMoveClick={alert} /> :
                    <>
                        {moves.length}手詰め
                        <Button onClick={() => {  }}>
                            Show Moves
                        </Button>
                    </>
                </Box>
            </Stack>
        </AppLayout>
    )
}