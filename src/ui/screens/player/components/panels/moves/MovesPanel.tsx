import { Box, Stack } from "@mui/material";

import MovesView from "./MovesView";
import ProblemLearningInfoPanel from "@/ui/screens/player/components/panels/ProblemLearningInfoPanel";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { MovesViewModel } from "@/ui/screens/player/vm/PlayerViewModel";

export default function MovesPanel({problem, movesModel, onMoveToPly}: { 
    problem: Problem, movesModel: MovesViewModel, onMoveToPly: (to: number)=> void
}) {
    const { moves, ply, visible, } = movesModel
    //const moveTo = useReplayStore(s=>s.moveTo)
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
                <MovesView moves={moves} currentPlyIndex={ply} onMoveToPly={onMoveToPly} />
                : (<Stack>
                    <ProblemLearningInfoPanel problem={problem} />
                </Stack>)
            }
        </Box>
    )
}


