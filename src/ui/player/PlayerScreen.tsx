import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import type { Problem } from "@/domain/problem/Problem"
import { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView from "./components/PlayerView"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"

////////////////////////////////
export function PlayerScreen({ title, problem, onNextProblem, onPrevProblem, onAnswer}: {
    title?: string,
    problem: Problem,
    //learning?: Learning,
    onNextProblem: () => void,
    onPrevProblem: () => void, 
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,
}) {
    const replay = useReplayController(problem.kifData)
    const [ showMoves, setShowMoves ] = useState(false)     
    const repos = useRepositoryContext()
    const learningStore = useLearningEventStore(repos.learningEvent)
    const learning = learningStore.records[problem.id]
    
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