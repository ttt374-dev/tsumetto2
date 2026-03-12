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



export const TimerControl = ({isTimerRunning, elaspedSec, onToggleTimer}: {
    onToggleTimer: () => void
    isTimerRunning: boolean
    elaspedSec: number
}) => {
    function formatTime(sec: number) {
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    return (
        <Box sx={{ p: 1 }}>
            <Button
                onClick={onToggleTimer}
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
                <Typography variant="body2" fontWeight="bold" sx={{ cursor: "pointer" }}>
                    {isTimerRunning ? "II" : "▶"} {formatTime(elaspedSec)}
                </Typography>
            </Button>
        </Box>)
}

export function ProblemLearningInfoPanel(props: {
    problem: Problem
    
}) {
    const { problem } = props
    const records = useLearningRecordStore(s=>s.records)
    const learning = records[problem.id
        
    ]
    return (<>
        <Box>タイプ：{problem.type}</Box>
        <Box>手数：{problem.kifData.moves.length}手</Box>
        {problem.source && <Box>出典：{problem.source}</Box>}
        {problem.tags && <Box>{problem.tags.join(",")}</Box>}

        {learning && formatLearningPerformance(learning)}

</>)
}
///////////////////////////////////////////////////////////////
export default function PlayerView({problem, title, timer}: {
    problem: Problem
    title: React.ReactNode,
    timer?: ReturnType<typeof useTimer>
}){
    const { ply, moveTo, position, revealAnswer, revealed } = useGameStore()

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
            <BoardView position={position} />                          

            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}
                <MovesPanel revealed={revealed} onRevealAnswer={revealAnswer}
                    ply={ply} moves={problem.kifData.moves} onMoveToPly={moveTo}/>

                { /* --- コントロールパネル ---*/}
                <Box flex={1} sx={{ border: 1, borderColor: "divider" }}>
                    {timer &&                        
                            <TimerControl
                                isTimerRunning={timer.isRunning}
                                onToggleTimer={timer.toggle}
                                elaspedSec={timer.seconds}
                            />
                        
                    }                    
                    <ProblemLearningInfoPanel problem={problem}/>
                </Box>
            </Stack>
        </Stack>
    )
}

