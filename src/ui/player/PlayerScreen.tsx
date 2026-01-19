import { Box, Button, Stack } from "@mui/material"
import { useState } from "react"
import { AppLayout } from "@/ui/common/AppLayout"
import BoardView from "./components/BoardView"
import MovesView from "./components/MovesView"
import type { Problem } from "@/domain/problem/Problem"
import type { Learning } from "@/domain/learning/Learning"
import type { SolvedResult } from "@/application/missionFsm/MissionFsm"
import { useReplayController } from "./useReplayController"

export function PlayerScreen({ problem, learning, onNext, onPrev, onAnswer}: {
    problem: Problem,
    learning?: Learning,
    onNext: () => void,
    onPrev: () => void, 
    onAnswer: (problem: Problem, answerResult: SolvedResult, secToTaken?: number) => void,
}) {    
    const moves = problem.kifData.moves
    const { position, plyIndex: currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, } = useReplayController(problem.kifData)  //  useReplayFsm(kifdata)
    const [ showMoves, setShowMoves ] = useState(false)      

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
                    <BoardView position={position} />
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