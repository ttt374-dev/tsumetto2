import { Box, Button, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { AppLayout } from "@/ui/common/AppLayout"
import BoardView from "./components/BoardView"
import MovesView from "./components/MovesView"
import type { Problem } from "@/domain/problem/Problem"
import type { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/mission/MissionSummary"

export function PlayerLearningStats({ learning }: { 
    learning: Learning 
}) {
    if (!learning) return
    return (
        <Stack direction="row" spacing={2}>
            <Box>
                {learning.solvedCount} /
                {learning.totalCount}
            </Box>
            <Box>
                ef{learning.easeFactor.toFixed(2)},
                next:{new Date(learning.nextReviewedAt).toLocaleString()}
            </Box>
        </Stack>
    )
}

////////////////////////////////
export function PlayerScreen({ problem, learning, onNextProblem, onPrevProblem, onAnswer}: {
    problem: Problem,
    learning?: Learning,
    onNextProblem: () => void,
    onPrevProblem: () => void, 
    onAnswer: (problem: Problem, answerResult: SolvedResult, secToTaken?: number) => void,
}) {
    const moves = problem.kifData.moves
    const { position, plyIndex: currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, } = useReplayController(problem.kifData)
    const [ showMoves, setShowMoves ] = useState(false)     
    
    useEffect(()=> { 
        setShowMoves(false)
        
    }, [problem.id])

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
            <BoardView position={position}/>
            <Stack justifyContent="center">
                <Box>
                    <BoardView position={position} />
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="center">
                <Button onClick={onPrevProblem}>
                    Prev
                </Button>
                <Button onClick={retreatPly} disabled={currentPlyIndex===0}>
                    Ret Ply
                </Button>
                <Button onClick={advancePly} disabled={currentPlyIndex===moves.length}>
                    Adv Ply
                </Button>
                <Button onClick={onNextProblem}>
                    Next
                </Button>
            </Stack>            


            <Box>
            { showMoves ?             
                <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveClick={moveToPly}/> :                
                <>
                    {moves.length}手詰め
                <Button onClick={() => { setShowMoves(true); advancePly()}}>
                    Show Moves
                </Button>
                </>
            }           
            { learning && <PlayerLearningStats learning={learning}/>}
            </Box>
        </AppLayout>
    )
}