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
import type { Problem } from "@/domain/problem/Problem"
import type { Learning } from "@/domain/learning/Learning"
import type { AnswerResult } from "@/application/missionFsm/MissionFsm"

export function PlayerScreen({ problem, learning, onNext, onPrev, onAnswer}: {
    problem: Problem,
    learning?: Learning,
    onNext: () => void,
    onPrev: () => void, 
    onAnswer: (problem: Problem, answerResult: AnswerResult, secToTaken?: number) => void,
}) {
    const [ showMoves, setShowMoves ] = useState(false)
    /*
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()
     */

    const { markAnswer, toggleStar } = useExercise()


    //const problemId = fsmState.queue[fsmState.currentIndex]?.problemId

    //const exercise = exerciseList.find((m) => m.problem.id === problemId)

    const navigate = useNavigate()

    // 最後のインデックスだったらサマリーに遷移
    /*
    useEffect(() => {
        if (fsmState.isFinished) {
            navigate("/summary", { state: { fsmState } })
        }
    }, [fsmState.isFinished, navigate]);
    */

    // answer から次へ自動遷移
    /*
    useEffect(() => {
        if (fsmState.phase === "answered")
            next()
    }, [fsmState.phase])
*/
    // 問題が変わったら手筋をリセット
    /*
    useEffect(() => {
        if (!fsmState) return

        //timer.reset()
        //timer.start()
        resetPly()
        setShowMoves(false)
    }, [fsmState.currentIndex])
    */

    //const kifdata = exercise?.problem.kifData ?? KifData.create()
    const kifdata = problem.kifData
    const { board, hands, moves, currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, resetPly,
    } = useReplayFsm(kifdata)

    


    if (!problem) {
        return (
            <>
                <Box>
                    NO MISSION
                </Box>

                <Button onClick={() => { navigate("/") }}>
                    Back
                </Button>
            </>)
    }

    return (
        <AppLayout
            header={problem.title}
            footer={
                <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="contained" onClick={() => { onAnswer(problem, "failed") }}>
                        Failed
                    </Button>

                    <Button fullWidth variant="contained" onClick={() => { onAnswer(problem, "solved") }}>
                        Solved
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => { onAnswer(problem, "solved", 5) }}>
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
                <Button onClick={onPrev}>
                    Prev
                </Button>
                <Button onClick={retreatPly}>
                    Ret Ply
                </Button>

                <Button onClick={advancePly}>
                    Adv Ply
                </Button>
                <Button onClick={onNext}>
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

            
            {learning &&
                <Stack direction="row" spacing={2}>
                    <Box>
                        {learning.solvedCount} /
                        {learning.totalCount}
                    </Box>
                    <Box>
                        ef{learning.easeFactor.toFixed(2)},
                        reviewed at {new Date(learning.nextReviewedAt).toLocaleString()}
                    </Box>


                </Stack>
            }
            </Box>
        </AppLayout>
    )
}