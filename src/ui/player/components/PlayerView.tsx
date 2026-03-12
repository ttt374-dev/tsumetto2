import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import React from "react"

import { formatLearningPerformance } from "@/ui/library/components/LibraryListItem"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import MovesPanel from "./panels/MovesPanel"
import BoardView from "@/ui/game/BoardView"
import { useTimerStore } from "@/ui/game/useTimerStore"

export const TimerControlPanel = () => {
    function formatTime(sec: number) {
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }
    const { toggle, isRunning, elapsedSec} = useTimerStore()
    return (

        <Button
            onClick={toggle}
            variant="contained"
            sx={{
                p: 1,
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
                {isRunning ? "II" : "▶"} {formatTime(elapsedSec)}
            </Typography>
        </Button>
        )
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
export function TitlePanel({title}: {title: React.ReactNode}) {
    return (<Box sx={{
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
    }}>
        <Typography variant="body1">{title} </Typography>
    </Box>)
    
}
///////////////////////////////////////////////////////////////
export default function PlayerView({problem, title}: {
    problem: Problem
    title: React.ReactNode,    
}){
    //const { ply, moveTo, position, revealAnswer, revealed } = useGameStore()

    return (
        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >            
            <TitlePanel title={title}/>
            { /* --- 盤面 ---*/}            
            <BoardView />

            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}
                <MovesPanel moves={problem.kifData.moves}/>

                { /* --- コントロールパネル ---*/}
                <Box flex={1} sx={{ border: 1, borderColor: "divider" }}>                    
                    <TimerControlPanel/>                    
                    <ProblemLearningInfoPanel problem={problem}/>
                </Box>
            </Stack>
        </Stack>
    )
}

