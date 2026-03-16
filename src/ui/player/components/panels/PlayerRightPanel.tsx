import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton"
import { IconButton, Stack } from "@mui/material"
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';

export function PlayerRightPanel(props: {
    problemId: ProblemId
    onNavigateToDetail: (id: ProblemId) => void
    onUndoLastAnswer?: () => void
}){
    const starController = useStarToggleButton(props.problemId)
    
    return (
        <Stack direction="row">
            <IconButton onClick={props.onUndoLastAnswer}
                sx={{ color: "white"}}
                disabled={props.onUndoLastAnswer === undefined}
            >
                <UndoIcon/>
            </IconButton>
            
            <StarToggleButton starred={starController.starred}
                sx={{ color: "white"}}
                onToggle={starController.toggleStar}
            />
            <IconButton
                sx={{ color: "white" }}
                onClick={() => props.onNavigateToDetail(props.problemId)}>
                <EditIcon />
            </IconButton>
        </Stack>
    )

}