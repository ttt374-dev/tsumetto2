import { Box, Button, Grid, Stack } from "@mui/material"
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
///////////////////////////////////////////////////////////////
function PlayerView({problem, problemNavigation}: {
    problem: Problem
    problemNavigation?: ProblemNavigation,   
}){
    const moves = problem.kifData.moves
    const replay = useReplayController(problem.kifData.initialPosition, moves)
    const showMovesController = useShowMovesController(replay.plyIndex)
    const learning: Learning | undefined = useLearningRecordStore(s=>s.records)[problem.id]

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
                            <Box>{moves.length}手詰め</Box>
                            <Box>{problem.tags.join(",")}</Box>
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
                </Box>
            </Stack>
        </Stack>
    )    
}

export default PlayerView