import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import type { Problem } from "@/domain/problem/Problem"
import { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/mission/MissionSummary"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import { PlayerView } from "./components/PlayerView"

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
export function PlayerScreen({ title, problem, learning, onNextProblem, onPrevProblem, onAnswer}: {
    title?: string,
    problem: Problem,
    learning?: Learning,
    onNextProblem: () => void,
    onPrevProblem: () => void, 
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,
}) {
    const replay = useReplayController(problem.kifData)
    const [ showMoves, setShowMoves ] = useState(false)     
    
    useEffect(()=> { 
        setShowMoves(false)        
    }, [problem.id])

    return (
        <PlayerView
            title={title ?? problem.title}
            showMoves={showMoves}
            moves={problem.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            currentPlyIndex={replay.plyIndex}
            setShowMoves={setShowMoves}
            footerActions={
                <PlayerFooterActions onAnswer={onAnswer} />
            }
        />
    )
}