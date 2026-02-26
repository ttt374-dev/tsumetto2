import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton"
import { IconButton, Stack } from "@mui/material"
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';

export function PlayerRightActions(props: {
    problemId: ProblemId
    onOpenDetailDialog: (id: ProblemId) => void
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
            
            <IconButton
                sx={{ color: "white" }}
                onClick={() => props.onOpenDetailDialog(props.problemId)}>
                <EditIcon />
            </IconButton>
        </Stack>
    )

}