import { Box, Button, Grid, Stack } from "@mui/material"
import { AppLayout } from "@/ui/common/AppLayout"
import type { Move, Position } from "@/domain/kif/types"
import MovesPanel from "./MovesPanel"
import MovesView from "./MovesView"
import { PlyControlPanel } from "./PlyControlPanel"
import { Learning } from "@/domain/learning/Learning"
import BoardPanel from "./BoardPanel"
import { formatLearning } from "@/ui/library/components/LibraryListItem"

export function InfoView({mateLength, learning}: {
    mateLength: number
    learning?: Learning
}){
    return (
        <Stack>
            <Box>
                {mateLength} 手詰め
            </Box>
            {learning && formatLearning(learning)}
        </Stack>
    )
}

export function PlayerLearningStats({ learning }: { 
    learning: Learning 
}) {
    if (!learning) return
    return (
        <Stack spacing={0}>
            <Box>
                { `${learning.solvedCount} : ${learning.failedCount}`}
            </Box>
            <Box>
                ef{learning.easeFactor.toFixed(2)}
            </Box>
            <Box>
                in {new Date(learning.nextReviewedAt).toLocaleString()}
            </Box>
        </Stack>
    )
}

type PlayerViewHandlers = {
    ply: {
        advance: () => void,
        retreat: () => void,
        moveTo: (index: number) => void,        
    },
    navigation?: {
        next: () => void,
        prev: () => void,
    },
    setShowMoves?: (flag: boolean) => void,
}
///////////////////////////////////////////////////////////////
function PlayerView({learning, position, moves, showMoves = true, currentPlyIndex, 
    onOpenListDialog, handlers}: {    
    learning?: Learning,
    position: Position,
    moves: Move[],
    showMoves?: boolean,
    currentPlyIndex: number,    
    handlers: PlayerViewHandlers,
    onOpenListDialog?: () => void,    
    
    }) {
    return (

        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
            { /* --- 盤面 ---*/}
            <BoardPanel position={position}
                onAdvancePly={handlers.ply.advance}
                onRetreatPly={handlers.ply.retreat}
                onNextProblem={handlers.navigation?.next}
                onPrevProblem={handlers.navigation?.prev} />
            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}

                <MovesPanel>
                    {showMoves ?
                        <MovesView moves={moves} currentPlyIndex={currentPlyIndex} onMoveToPly={handlers.ply.moveTo} />
                        : (<Stack>
                            <Button onClick={() => handlers.setShowMoves?.(true)} >
                                手筋を表示
                            </Button>
                            {moves.length}手詰め
                        </Stack>)
                    }
                </MovesPanel>

                { /* --- コントロールパネル ---*/}
                <Box flex={0.75} sx={{ border: 1, borderColor: "divider" }}>
                    <PlyControlPanel
                        currentPlyIndex={currentPlyIndex}
                        maxPlyIndex={moves.length}
                        onPrevPly={handlers.ply.retreat}
                        onNextPly={() => {
                            handlers.ply.advance()
                        }}
                    />
                    <Button onClick={onOpenListDialog}>
                        リスト表示
                    </Button>
                    {learning && formatLearning(learning)}
                </Box>
            </Stack>
        </Stack>
    )    
}

export default PlayerView