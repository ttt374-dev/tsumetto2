import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"
import { PlayerFooterActions } from "./components/PlayerFooterActions"
import PlayerView from "./components/PlayerView"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
import { KifData } from "@/domain/kif/types"

////////////////////////////////
export function PlayerScreen({ titlePrefix, problemId, onNextProblem, onPrevProblem, onAnswer}: {
    titlePrefix?: string,
    problemId: ProblemId,
    onNextProblem: () => void,
    onPrevProblem: () => void, 
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,
}) {
    const [ showMoves, setShowMoves ] = useState(false)     

    const repos = useRepositoryContext()    
    const problem = useProblemStore(repos.problem).problems.find(p=> p.id === problemId) 
    const replay = useReplayController(problem?.kifData ?? KifData.create())    
    const learningStore = useLearningEventStore(repos.learningEvent)    
    const learning = problem && learningStore.records[problem.id]
    
    useEffect(()=> { 
        setShowMoves(false)        
    }, [problem?.id])

    useEffect(()=>{
        if (replay.plyIndex > 0){
            setShowMoves(true)
        } else if (replay.plyIndex === 0){
            setShowMoves(false)
        }
    }, [replay.plyIndex])

    if (!problem) return null
    console.log("play screen: learning", learning)
    return (
        <PlayerView
            title={`${titlePrefix}${problem.title}`}
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