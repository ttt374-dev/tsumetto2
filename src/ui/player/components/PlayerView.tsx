import { Box, Button, Grid, Stack } from "@mui/material"
import type { Move, Position } from "@/domain/kif/types"
import MovesPanel from "./MovesPanel"
import MovesView from "./MovesView"
import { PlyControlPanel } from "./PlyControlPanel"
import { Learning } from "@/domain/learning/Learning"
import BoardPanel from "./BoardPanel"
import { formatLearning } from "@/ui/library/components/LibraryListItem"
import type { ProblemId } from "@/domain/problem/Problem"
import { useReplayController } from "../hooks/useReplayController"

export type PlayerViewNavigationHandlers = {
    next: () => void,
    prev: () => void,
    moveTo: (problemId: ProblemId) => void,
}

export type PlayerViewHandlers = {
    ply: {
        advance: () => void,
        retreat: () => void,
        moveTo: (index: number) => void,        
    },
    navigation: PlayerViewNavigationHandlers,
    setShowMoves: (flag: boolean) => void,
}
///////////////////////////////////////////////////////////////
function PlayerView({learning, position, moves, showMoves = true, tags, handlers}: {
    position: Position,
    moves: Move[],
    //currentPlyIndex: number,    
    handlers: PlayerViewHandlers,    
    showMoves: boolean,
    learning?: Learning,
    tags: string[],
}){
    const replay = useReplayController(position, moves)

    return (

        <Stack sx={{ minHeight: 0, height: "100%" }} spacing={1} >
            { /* --- 盤面 ---*/}
            <BoardPanel position={replay.position}
                onAdvancePly={replay.advancePly}
                onRetreatPly={replay.retreatPly}
                onNextProblem={handlers.navigation?.next}
                onPrevProblem={handlers.navigation?.prev} />
            <Stack direction="row" sx={{ minHeight: 0, flexGrow: 1, p: 1 }} spacing={1}>
                { /* --- 手筋 ---*/}

                <MovesPanel>
                    {showMoves ?
                        <MovesView moves={moves} currentPlyIndex={replay.plyIndex} onMoveToPly={replay.moveToPly} />
                        : (<Stack>
                            <Button onClick={() => handlers.setShowMoves(true)} >
                                手筋を表示
                            </Button>
                            <Box>{moves.length}手詰め</Box>
                            <Box>{ tags.join(",")}</Box>
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