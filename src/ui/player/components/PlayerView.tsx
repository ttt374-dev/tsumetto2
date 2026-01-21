import { Box, Button, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { AppLayout } from "@/ui/common/AppLayout"
import type { Move, Position } from "@/domain/kif/types"
import BoardView from "./BoardView"
import SidePanel from "./SidePanel"
import MovesView from "./MovesView"
import { PlyControlPanel } from "./PlyControlPanel"

///////////////////////////////////////////////////////////////
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
            footer={footerActions}>
            <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
                { /* --- 盤面 ---*/ }
                <BoardView position={position} />
                <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1}} spacing={1}>                    
                    { /* --- 手筋 ---*/ }
                    <SidePanel>
                        {showMoves ?
                            <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveToPly={onMoveToPly} />
                            : (<Box onClick={() => setShowMoves(true)}>
                                {moves.length} 手詰め
                            </Box>)
                        }
                    </SidePanel>
                        
                    { /* --- コントロールパネル ---*/ }
                    <Box sx={{ border: 1, borderColor: "divider" }}>
                        <PlyControlPanel
                            currentPlyIndex={currentPlyIndex}
                            maxPlyIndex={moves.length}
                            onPrevPly={retreatPly}
                            onNextPly={() => {
                                advancePly()
                                setShowMoves(true)
                            }}
                            onReset={() => {
                                onMoveToPly(0)
                                setShowMoves(false)
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>
        </AppLayout>
    )    
}