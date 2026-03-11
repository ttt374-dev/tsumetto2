import { Box, Button, Grid, Stack, Typography } from "@mui/material"

import MovesView from "./views/MovesView"
import { formatLearningPerformance } from "@/ui/library/components/LibraryListItem"
import type { Problem } from "@/domain/problem/entity/Problem"
import React, {  useEffect, useState } from "react"
import type { ProblemNavigation } from "../PlayerScreen"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { useTimer } from "../hooks/useTimer"
import MovesPanel from "./panels/MovesPanel"
import type { Learning } from "@/domain/learning/entity/Learning"
import { useGameStore } from "@/ui/game/useGameStore"
import BoardView from "@/ui/game/BoardView"


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
export default function PlayerView({problem, title, problemNavigation, timer}: {
    problem: Problem
    title: React.ReactNode,
    problemNavigation?: ProblemNavigation,
    timer?: ReturnType<typeof useTimer>
}){
    const moves = problem.kifData.moves
    const [showMoves, setShowMoves ] = useState(false)    
    //const { advancePly, retreatPly, plyIndex, moveToPly, position, reveal } = useReplayStore()
    const { advancePly, retreatPly, ply, moveTo, position, revealAnswer: reveal } = useGameStore()
    
    useEffect(() => {
        setShowMoves(false)
    }, [problem])
    
    const handleShowMoves = () => {
        setShowMoves(true)
        reveal() // TODO
    }
    
    const learning: Learning | undefined = useLearningRecordStore(s=>s.records)[problem.id]

    return (
        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >            
            <Box sx={{
                whiteSpace: "nowrap",
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
            }}>
                <Typography variant="body1">{title} </Typography>
            </Box>
            { /* --- 盤面 ---*/}
            <Stack justifyContent="center" direction="row" alignContent="center">
                <Box>   { /* センタリングするために必要 */}
                    <BoardView position={position} />
                </Box>
            </Stack>            

            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}
                <MovesPanel>
                    {showMoves ?
                        <MovesView moves={moves} currentPlyIndex={ply} onMoveToPly={moveTo} />
                        : (<Stack>
                            <Button onClick={() => handleShowMoves()} variant="outlined">
                                手筋を表示
                            </Button>                            
                            
                        </Stack>)
                    }
                </MovesPanel>

                { /* --- コントロールパネル ---*/}
                <Box flex={1} sx={{ border: 1, borderColor: "divider" }}>
                    {timer &&
                        <Box sx={{ p: 1 }}>
                            <TimerControl
                                isTimerRunning={timer.isRunning}
                                onToggleTimer={timer.toggle}
                                elaspedSec={timer.seconds}
                            />
                        </Box>
                    }
                    { /* 
                    <PlyControlPanel
                        currentPlyIndex={plyIndex}
                        maxPlyIndex={moves.length}
                        onPrevPly={retreatPly}
                        onNextPly={ () => { handleShowMoves(); advancePly()}}
                    />*/ }
                    
                    <Box>タイプ：{problem.type}</Box>
                    <Box>手数：{moves.length}手</Box>
                    { problem.source && <Box>出典：{problem.source}</Box> }
                    { problem.tags && <Box>{problem.tags.join(",")}</Box> }

                    {learning && formatLearningPerformance(learning)}


                </Box>
            </Stack>
        </Stack>
    )
}

