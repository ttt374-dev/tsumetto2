import { Box, Button, Stack } from "@mui/material";
import MovesView from "../views/MovesView";
import type { Move } from "@/domain/kif/entity";
import { useGameStore } from "@/ui/player/hooks/useGameStore";
import { useTimerStore } from "@/ui/player/hooks/useTimerStore";


export default function MovesPanel({moves}: { moves: Move[]}) {
    const { ply, moveTo, revealAnswer, state} = useGameStore()
    const timer = useTimerStore()

    const handleRevealAnswer = () => {
        revealAnswer(timer.elapsedSec)
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
            {state.isRevealed ?
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


