import { Box, Button, Stack } from "@mui/material";

import MovesView from "../views/MovesView";
import type { Move } from "@/domain/kif/entity";
import { useReplayStore } from "@/ui/player/hooks/useReplayStore";
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext";
import { useGameStore } from "@/ui/player/hooks/useGameStore";
import ProblemLearningInfoPanel from "@/ui/player/components/panels/ProblemLearningInfoPanel";
import type { Problem } from "@/domain/problem/entity/Problem";

export default function MovesPanel({moves, isMovesVisible, problem}: { 
    moves: Move[]
    isMovesVisible: boolean
    problem: Problem
}) {
    const moveTo = useReplayStore(s=>s.moveTo)
    const ply = useReplayStore(s=>s.ply)
    const dispatch = useGameStore(s=>s.dispatch)   
    const ctx = createPlayerContext()

    const handleRevealAnswer = () => {
        dispatch({type: "REVEAL", ...ctx})
    }
    
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
                    <Box>手数：{moves.length}手</Box>
                    <ProblemLearningInfoPanel problem={problem} />
                </Stack>)
            }
        </Box>
    )
}


