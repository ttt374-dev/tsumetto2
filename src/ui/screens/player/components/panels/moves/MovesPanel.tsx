import { Box, Stack } from "@mui/material";

import MovesView from "./MovesView";
import ProblemLearningInfoPanel from "@/ui/screens/player/components/panels/ProblemLearningInfoPanel";
import type { Move } from "@/domain/kif/entity";
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore";
import type { Problem } from "@/domain/problem/entity/Problem";

export default function MovesPanel({moves, isMovesVisible, problem}: { 
    moves: Move[]
    isMovesVisible: boolean
    problem: Problem
}) {
    const moveTo = useReplayStore(s=>s.moveTo)
    const ply = useReplayStore(s=>s.ply)

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
            {isMovesVisible ?
                <MovesView moves={moves} currentPlyIndex={ply} onMoveToPly={moveTo} />
                : (<Stack>
                    <ProblemLearningInfoPanel problem={problem} />
                </Stack>)
            }
        </Box>
    )
}


