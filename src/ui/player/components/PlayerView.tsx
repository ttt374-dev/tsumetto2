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

///////////////////////////////////////////////////////////////
function PlayerView({title, learning, position, showMoves = true, currentPlyIndex, 
    onNextProblem, onPrevProblem, onOpenDetailDialog, onOpenListDialog,
    retreatPly, advancePly, moves, setShowMoves, onMoveToPly, footerActions}: {
    title: string,
    learning?: Learning,
    position: Position,
    moves: Move[],
    showMoves?: boolean,
    currentPlyIndex: number,
    retreatPly: () => void,
    advancePly: () => void,
    onMoveToPly: (index: number) => void,
    setShowMoves?: (flag: boolean) => void,
    onPrevProblem?: () => void,
    onNextProblem?: () => void,
    onOpenDetailDialog?: () => void,
    onOpenListDialog?: () => void,    
    footerActions?: React.ReactNode
}){
    return (
        <AppLayout
            header={title}
            footer={footerActions}
            rightActions={
                <Button onClick={onOpenDetailDialog}>
                    Detail
                </Button>
            }
            >
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
                            : (<Stack>
                            <Button onClick={() => setShowMoves?.(true)} >
                                手筋を表示
                            </Button>
                            {moves.length}手詰め
                            </Stack>)
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
                            }}
                        />
                        <Button onClick={onOpenListDialog}>
                            リスト表示
                        </Button>
                        { learning && formatLearning(learning)}
                    </Box>
                </Stack>
            </Stack>
        </AppLayout>
    )    
}

export default PlayerView