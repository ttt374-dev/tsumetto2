import { Box, Button, Stack } from "@mui/material";

import MovesView from "../views/MovesView";
import type { Move } from "@/domain/kif/entity";
import { useReplayStore } from "@/ui/player/hooks/useReplayStore";
import { createGameController } from "@/ui/player/hooks/createGameController";
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext";

export default function MovesPanel({moves, isMovesVisible}: { 
    moves: Move[]
    isMovesVisible: boolean
}) {
    const moveTo = useReplayStore(s=>s.moveTo)
    const ply = useReplayStore(s=>s.ply)
    const controller = createGameController() 
    

    const handleRevealAnswer = () => {
        controller.markRevealed()
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
                    <Button onClick={handleRevealAnswer} variant="outlined">
                        手筋を表示
                    </Button>
                    <Box>手数：{moves.length}手</Box>
                </Stack>)
            }
        </Box>
    )
}


