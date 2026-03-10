import { Box, Button, Grid, Stack, Typography } from "@mui/material"

import MovesView from "./views/MovesView"
import PlyControlPanel from "./panels/PlyControlPanel"
import BoardPanel from "./panels/BoardPanel"
import { formatLearningPerformance } from "@/ui/library/components/LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useReplayController } from "../hooks/useReplayController"
import React, { createContext, useEffect, useState } from "react"
import type { ProblemNavigation } from "../PlayerScreen"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { useTimer } from "../hooks/useTimer"
import MovesPanel from "./panels/MovesPanel"
import type { Learning } from "@/domain/learning/entity/Learning"
import { Move, Piece, type Player, type Square } from "@/domain/kif/entity"
import { selectPosition, useReplayStore } from "../hooks/useReplayStore"


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
function PlayerView({problem, title, problemNavigation, timer}: {
    problem: Problem
    title: React.ReactNode,
    problemNavigation?: ProblemNavigation,
    timer?: ReturnType<typeof useTimer>
}){
    const moves = problem.kifData.moves
    const { load, advancePly, retreatPly, plyIndex, moveToPly, position } = useReplayStore()

    
    useEffect(() => {
        load(problem)
        setShowMoves(false)
    }, [problem])
    const [showMoves, setShowMoves ] = useState(false)
    
    const learning: Learning | undefined = useLearningRecordStore(s=>s.records)[problem.id]

    return (
        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >            
            <Box sx={{
                whiteSpace: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
            }}>
                <Typography variant="h6">{title} </Typography>
            </Box>
            { /* --- 盤面 ---*/}

            <BoardPanel
                position={position}
                onAdvancePly={advancePly}
                onRetreatPly={retreatPly}
                onNextProblem={problemNavigation?.next}
                onPrevProblem={problemNavigation?.prev} />

            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}

                <MovesPanel>
                    {showMoves ?
                        <MovesView moves={moves} currentPlyIndex={plyIndex} onMoveToPly={moveToPly} />
                        : (<Stack>
                            <Button onClick={() => setShowMoves(true)} >
                                手数：{moves.length}手
                            </Button>                            
                            <Box>{problem.tags.join(",")}</Box>
                            <Box>出典：{problem.source}</Box>
                        </Stack>)
                    }
                </MovesPanel>

                { /* --- コントロールパネル ---*/}
                <Box flex={0.75} sx={{ border: 1, borderColor: "divider" }}>
                    <PlyControlPanel
                        currentPlyIndex={plyIndex}
                        maxPlyIndex={moves.length}
                        onPrevPly={retreatPly}
                        onNextPly={advancePly}
                    />
                    {learning && formatLearningPerformance(learning)}

                    {timer &&
                        <Box sx={{ p: 1 }}>
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
export default PlayerView