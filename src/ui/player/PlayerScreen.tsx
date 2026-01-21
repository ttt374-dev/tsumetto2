import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { AppLayout } from "@/ui/common/AppLayout"
import BoardView from "./components/BoardView"
import MovesView from "./components/MovesView"
import type { Problem } from "@/domain/problem/Problem"
import { Learning } from "@/domain/learning/Learning"
import { useReplayController } from "./useReplayController"
import type { SolvedResult } from "@/domain/mission/MissionSummary"
import SidePanel from "./components/SidePanel"
import type { Move, Position } from "@/domain/kif/types"

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

type AnswerAction = {
  label: string
  result: SolvedResult
  secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
  { label: "Failed", result: "failed" },
  { label: "Solved", result: "solved" },
  { label: "Easy", result: "solved", secToTaken: 5 },
]

export function PlayerFooterActions({onAnswer}: {
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,    
}){
return (
    <Stack direction="row" spacing={1}>
      {ANSWER_ACTIONS.map(({ label, result, secToTaken }) => (
        <Button
          key={label}
          fullWidth
          variant="contained"
          onClick={() => onAnswer(result, secToTaken)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  )
}

export function PlayerView({title, position, showMoves, currentPlyIndex, 
    retreatPly, advancePly, moves, setShowMoves, onMoveToPly, footerActions}: {
    title: string,
    //learning: Learning,
    position: Position,
    showMoves: boolean,
    currentPlyIndex: number,
    retreatPly: () => void,
    advancePly: () => void,
    onMoveToPly: (index: number) => void,
    setShowMoves: (flag: boolean) => void,
    moves: Move[],
    footerActions?: React.ReactNode
}){
    return (
        <AppLayout
            header={title}
            footer={footerActions}
        >
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                <BoardView position={position} />

                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1}} spacing={1}>
                    
                    <SidePanel>
                        {showMoves ?
                            <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveToPly={onMoveToPly} />
                            : (<Box onClick={() => setShowMoves(true)}>
                                {moves.length} 手詰め
                            </Box>)
                        }
                    </SidePanel>

                    <Box sx={{ border: 1, borderColor: "divider" , flex: 0.75}}>
                        <Stack direction="column" p={1} spacing={1}>
                            <Button variant="outlined" onClick={retreatPly} disabled={currentPlyIndex === 0}>
                                Ret Ply
                            </Button>
                            <Button variant="contained" onClick={ () => {
                                    advancePly();
                                    setShowMoves(true)
                                }
                            } disabled={currentPlyIndex === moves.length}>
                                Adv Ply
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </AppLayout>
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