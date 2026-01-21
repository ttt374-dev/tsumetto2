import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { AppLayout } from "@/ui/common/AppLayout"
import type { Move, Position } from "@/domain/kif/types"
import BoardView from "./BoardView"
import MovesPanel from "./MovesPanel"
import MovesView from "./MovesView"
import { PlyControlPanel } from "./PlyControlPanel"
import { PlayerLearningStats } from "../PlayerScreen"
import { Learning } from "@/domain/learning/Learning"
import BoardPanel from "./BoardPanel"

export function InfoView({movesLength, learning}: {
    movesLength: number
    learning?: Learning
}){
    return (
        <Stack>
            <Box>
                {movesLength} 手詰め
            </Box>
            {learning && <PlayerLearningStats learning={learning} />}
        </Stack>
    )
}
///////////////////////////////////////////////////////////////
function PlayerView({title, learning, position, showMoves, currentPlyIndex, 
    onNextProblem, onPrevProblem,
    retreatPly, advancePly, moves, setShowMoves, onMoveToPly, footerActions}: {
    title: string,
    learning?: Learning,
    position: Position,
    showMoves: boolean,
    currentPlyIndex: number,
    retreatPly: () => void,
    advancePly: () => void,
    onMoveToPly: (index: number) => void,
    setShowMoves: (flag: boolean) => void,
    onPrevProblem?: () => void,
    onNextProblem?: () => void,
    moves: Move[],
    footerActions?: React.ReactNode
}){
    return (
        <AppLayout
            header={title}
            footer={footerActions}>
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                { /* --- 盤面 ---*/ }
                <BoardPanel position={position}
                    onAdvancePly={advancePly}
                    onRetreatPly={retreatPly}
                    onNextProblem={onNextProblem}
                    onPrevProblem={onPrevProblem} />
                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1}} spacing={1}>                    
                    { /* --- 手筋 ---*/ }
                    
                    <MovesPanel>
                        {showMoves ?
                            <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveToPly={onMoveToPly} />                            
                            : <Button onClick={() => setShowMoves(true)} >
                                Show Moves
                                </Button>
                        }
                    </MovesPanel>                    
                        
                    { /* --- コントロールパネル ---*/ }
                    <Box flex={0.75} sx={{ border: 1, borderColor: "divider" }}>
                        <PlyControlPanel
                            currentPlyIndex={currentPlyIndex}
                            maxPlyIndex={moves.length}
                            onPrevPly={retreatPly}
                            onNextPly={() => {
                                advancePly()
                                //setShowMoves(true)
                            }}
                            onReset={() => {
                                onMoveToPly(0)
                                //setShowMoves(false)
                            }}
                        />
                        <Box>
                            {moves.length} 手詰み
                        </Box>
                        { learning && <PlayerLearningStats learning={learning}/>}
                    </Box>
                </Stack>
            </Stack>
        </AppLayout>
    )    
}

export default PlayerView