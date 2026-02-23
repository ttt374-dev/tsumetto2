import EditIcon from '@mui/icons-material/Edit';

import type { ProblemId } from "@/domain/problem/Problem"
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton"
import { IconButton, Stack } from "@mui/material"
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';

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