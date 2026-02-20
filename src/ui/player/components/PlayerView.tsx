import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import type { Move, Position } from "@/domain/kif/types"
import MovesPanel from "./MovesPanel"
import MovesView from "./MovesView"
import { PlyControlPanel } from "./PlyControlPanel"
import { Learning } from "@/domain/learning/Learning"
import BoardPanel from "./BoardPanel"
import { formatLearning } from "@/ui/library/components/LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { useReplayController } from "../hooks/useReplayController"
import { useEffect, useState } from "react"
import type { ProblemNavigation } from "../PlayerScreen"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import { useTimer } from "../hooks/useTimer"


export function useShowMovesController(plyIndex: number) {
    const [showMoves, setShowMoves] = useState(false)
    useEffect(() => {
        if (plyIndex > 0) {
            setShowMoves(true)
        } else if (plyIndex === 0) {
            setShowMoves(false)
        }
    }, [plyIndex])
    
    return { showMoves, setShowMoves }
}


function formatTime(sec: number) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
}

export const TimerControl = ({isTimerRunning, elaspedSec, onToggleTimer}: {
    onToggleTimer: () => void
    isTimerRunning: boolean
    elaspedSec: number
}) => {
    return (
        <Button
            variant="contained"
            sx={{
                borderRadius: 2,
                background: "linear-gradient(145deg, #ffffff, #e6e6e6)",

                color: "#333",
                textTransform: "none",
                "&:hover": {
                    background: "linear-gradient(145deg, #f0f0f0, #dcdcdc)",
                },
            }}
        >
            <Typography variant="body2" fontWeight="bold" sx={{ cursor: "pointer" }}
                onClick={onToggleTimer}
            >
                {isTimerRunning ? "II" : "▶"} {formatTime(elaspedSec)}
            </Typography>
        </Button>)
}

///////////////////////////////////////////////////////////////
function PlayerView({problem, problemNavigation, timer}: {
    problem: Problem
    problemNavigation?: ProblemNavigation,   
    timer?: ReturnType<typeof useTimer>  // optional
}){
    const moves = problem.kifData.moves
    const replay = useReplayController(problem.kifData.initialPosition, moves)
    const showMovesController = useShowMovesController(replay.plyIndex)
    const learning: Learning | undefined = useLearningRecordStore(s=>s.records)[problem.id]
    //const timerController = useTimerController(problem.id)

    return (
        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
            
            { /* --- 盤面 ---*/}
            <BoardPanel position={replay.position}
                onAdvancePly={replay.advancePly}
                onRetreatPly={replay.retreatPly}
                onNextProblem={problemNavigation?.next}
                onPrevProblem={problemNavigation?.prev} />
            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}

                <MovesPanel>
                    {showMovesController.showMoves ?
                        <MovesView moves={moves} currentPlyIndex={replay.plyIndex} onMoveToPly={replay.moveToPly} />
                        : (<Stack>
                            <Button onClick={() => showMovesController.setShowMoves(true)} >
                                手筋を表示
                            </Button>
                            <Box>手数：{moves.length}手</Box>
                            { problem.tags.length > 0 && 
                            <Box>Tags:{problem.tags.join(",")}</Box>
}
                        </Stack>)
                    }
                </MovesPanel>

                { /* --- コントロールパネル ---*/}
                <Box flex={0.75} sx={{ border: 1, borderColor: "divider" }}>
                    <PlyControlPanel
                        currentPlyIndex={replay.plyIndex}
                        maxPlyIndex={moves.length}
                        onPrevPly={replay.retreatPly}
                        onNextPly={replay.advancePly}
                    />
                    {learning && formatLearning(learning)}

                    {timer &&
                        <Box sx={{p: 1}}>
                        <TimerControl
                            isTimerRunning={timer.isRunning}
                            onToggleTimer={timer.toggle}
                            elaspedSec={timer.seconds}
                        />
                        </Box>
                        }
                    
                </Box>
            </Stack>
        </Stack>
    )    
}

export default PlayerView