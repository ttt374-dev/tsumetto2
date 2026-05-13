import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton"
import { IconButton, Stack } from "@mui/material"
import { useProblemStar } from '@/ui/common/components/StarToggleButton/useProblemStar';

export default function PlayerRightPanel(props: {
    problemId: ProblemId
    onNavigateToDetail: (id: ProblemId) => void
    onUndoLastAnswer?: () => void
    onDelete: (id: ProblemId) => void
}){
    const starController = useProblemStar(props.problemId)
    
    return (
        <Stack direction="row">
            {/*
            <IconButton onClick={props.onUndoLastAnswer}
                sx={{ color: "white"}}
                disabled={props.onUndoLastAnswer === undefined}
            >
                <UndoIcon/>
            </IconButton>
            */}
            <StarToggleButton starred={starController.starred}
                sx={{ color: "white"}}
                onToggle={starController.toggleStar}
            />
            <IconButton
                sx={{ color: "white" }}
                onClick={() => props.onNavigateToDetail(props.problemId)}>
                <EditIcon />
            </IconButton>
            <IconButton
                sx={{ color: "white" }}
                onClick={() => props.onDelete(props.problemId)}>
                <DeleteIcon />
            </IconButton>
            
        </Stack>
    )

}