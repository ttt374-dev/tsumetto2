import type { Position } from "@/domain/kif/entity";
import { Box, Button, Stack } from "@mui/material";
import BoardView from "../views/BoardView";
import SwipeWrapper from "../SwipeWrapper";

function BoardPanel({ position, onAdvancePly, onRetreatPly, onNextProblem, onPrevProblem }: { 
    position: Position
    onAdvancePly: () => void
    onRetreatPly: () => void
    onNextProblem?: () => void
    onPrevProblem?: () => void
 }){
        const swipeActions = {
        onRight: onPrevProblem,
        onLeft: onNextProblem,
        onDown: () => {
            
            onAdvancePly()
        },
        onUp: () => {            
            onRetreatPly()
        }
    }
    return (
        <Stack justifyContent="center" direction="row" alignContent="center">
            {onPrevProblem &&
                <Button onClick={onPrevProblem}>&lt;</Button>}
            <Box>   { /* センタリングするために必要 */}
                <SwipeWrapper actions={swipeActions}>
                    <BoardView position={position} />
                </SwipeWrapper>
            </Box>
            {onNextProblem &&
                <Button onClick={onNextProblem}>&gt;</Button>}

        </Stack>
    )
}

export default BoardPanel