import EditIcon from '@mui/icons-material/Edit';

import { useStarToggleButton } from "@/application/useStarToggleButton"
import type { ProblemId } from "@/domain/problem/Problem"
import { StarToggleButton } from "@/ui/common/components/StarToggleButton"
import { IconButton, Stack } from "@mui/material"

export function PlayerRightActions(props: {
    problemId: ProblemId
    onOpenDetailDialog: (id: ProblemId) => void
}){
    const starController = useStarToggleButton(props.problemId)
    
    return (
        <Stack direction="row">
            <StarToggleButton
                starred={starController.starred}
                onToggle={starController.toggleStar}
                sx={{ color: "white" }}
            />
            <IconButton
                sx={{ color: "white" }}
                onClick={() => props.onOpenDetailDialog(props.problemId)}>
                <EditIcon />
            </IconButton>
        </Stack>
    )

}