import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import type { Problem } from "@/domain/problem/Problem"
import { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/mission/MissionSummary"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView from "./components/PlayerView"

export function PlayerLearningStats({ learning }: { 
    learning: Learning 
}) {
    if (!learning) return
    return (
        <Stack spacing={1}>
            <Box>
                { `${learning.solvedCount} : ${learning.failedCount}`}
            </Box>
            <Box>
                ef{learning.easeFactor.toFixed(2)}
            </Box>
            <Box>
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

    useEffect(()=>{
        if (replay.plyIndex > 0){
            setShowMoves(true)
        } else if (replay.plyIndex === 0){
            setShowMoves(false)
        }
    }, [replay.plyIndex])

    console.log("play screen: learning", learning)
    return (
        <PlayerView
            title={title ?? problem.title}
            learning={learning}
            showMoves={showMoves}
            moves={problem.kifData.moves}
            position={replay.position}
            retreatPly={replay.retreatPly}
            advancePly={replay.advancePly}
            onMoveToPly={replay.moveToPly}
            currentPlyIndex={replay.plyIndex}
            onNextProblem={onNextProblem}
            onPrevProblem={onPrevProblem}
            setShowMoves={setShowMoves}
            footerActions={
                <PlayerFooterActions onAnswer={onAnswer} />
            }
        />
    )
}