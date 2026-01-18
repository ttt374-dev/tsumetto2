import { useFsmContext } from "../App/providers/fsmProvider"
import { Box, Button, List, ListItem, Stack } from "@mui/material"
import { useExercise } from "../../application/useExercise"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "../common/AppLayout"
import BoardView from "./components/BoardView"
import { useReplayFsm } from "../../application/ReplayFsm/useReplayFsm"
import MovesView from "./components/MovesView"
import { Position, KifData } from "@/domain/kif/types"

export function PlayerScreen() {
    const [ showMoves, setShowMoves ] = useState(false)
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()

    const { exerciseList, markAnswer, toggleStar } = useExercise()

    const problemId = fsmState.queue[fsmState.currentIndex]?.problemId
    const exercise = exerciseList.find((m) => m.problem.id === problemId)

    const navigate = useNavigate()

    // 最後のインデックスだったらサマリーに遷移
    useEffect(() => {
        if (fsmState.isFinished) {
            navigate("/summary", { state: { fsmState } })
        }
    }, [fsmState.isFinished, navigate]);

    // answer から次へ自動遷移
    /*
    useEffect(() => {
        if (fsmState.phase === "answered")
            next()
    }, [fsmState.phase])
*/
    // 問題が変わったら手筋をリセット
    useEffect(() => {
        if (!fsmState) return

        //timer.reset()
        //timer.start()
        resetPly()
        setShowMoves(false)
    }, [fsmState.currentIndex])

    const kifdata = exercise?.problem.kifData ?? KifData.create()
    const { board, hands, moves, currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, resetPly,
    } = useReplayFsm(kifdata)

    


    if (!exercise) {
        return (
            <>
                <Box>
                    NO MISSION
                </Box>

                <Button onClick={() => { navigate("/dashboard") }}>
                    Back
                </Button>
            </>)
    }

    return (
        <AppLayout
            header={exercise.problem.title}
            footer={
                <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(exercise, "failed"); fail() }}>
                        Failed
                    </Button>

                    <Button fullWidth variant="contained" onClick={() => { markAnswer(exercise, "solved"); solve() }}>
                        Solved
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(exercise, "solved", 3); solve() }}>
                        easy
                    </Button>


                </Stack>
            }
        >
            <Stack justifyContent="center">
                <Box>
                    <BoardView board={board} hands={hands} />
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="center">
                <Button onClick={prev}>
                    Prev
                </Button>
                <Button onClick={retreatPly}>
                    Ret Ply
                </Button>

                <Button onClick={advancePly}>
                    Adv Ply
                </Button>
                <Button onClick={next}>
                    Next
                </Button>
            </Stack>
            

            <Box>
            { showMoves && 
            
                <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveClick={moveToPly}/>
            
            }
            { !showMoves &&
            <Button onClick={() => { setShowMoves(true)}}>
                Show MOves
            </Button>}

            
            {exercise.learning &&
                <Stack direction="row" spacing={2}>
                    <Box>
                        {exercise.learning.solvedCount} /
                        {exercise.learning.totalCount}
                    </Box>
                    <Box>
                        ef{exercise.learning.easeFactor.toFixed(2)},
                        reviewed at {new Date(exercise.learning.nextReviewedAt).toLocaleString()}
                    </Box>


                </Stack>
            }
            </Box>
        </AppLayout>
    )
}