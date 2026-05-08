import { Box, Stack } from "@mui/material";

import MovesView from "./MovesView";
import ProblemLearningInfoPanel from "@/ui/screens/player/components/panels/ProblemLearningInfoPanel";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { MovesViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import type { MovesActions } from "@/ui/screens/player/hooks/usePlayerActions";

export default function MovesPanel({problem, movesModel, actions}: { 
    problem: Problem, movesModel: MovesViewModel, actions: MovesActions
}) {
    const { moves, ply, visible, learningState} = movesModel
    const { moveToPly } = actions
    return (
        <Box
            flex={1}
            border={1}
            borderColor="divider"
            sx={
                {
                    display: "flex",
                    justifyContent: "center",
                    overflowY: "auto",
                    //flexGrow: 1,
                    gap: 2,
                    p: 1,
                }
            }
        >
            {visible ?
                <MovesView moves={moves} currentPlyIndex={ply} onMoveToPly={moveToPly} />
                : (<Stack>
                    <ProblemLearningInfoPanel problem={problem} learningState={learningState} />
                </Stack>)
            }
        </Box>
    )
}


