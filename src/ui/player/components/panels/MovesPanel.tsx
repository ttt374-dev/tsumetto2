import { Box, Button, Stack } from "@mui/material";
import MovesView from "../views/MovesView";
import type { Move } from "@/domain/kif/entity";
import { useGameStore } from "@/ui/player/hooks/useGameStore";


export default function MovesPanel({moves}: { moves: Move[]}) {
    const { ply, moveTo, revealAnswer, revealed } = useGameStore()
    
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
            {revealed ?
                <MovesView moves={moves} currentPlyIndex={ply} onMoveToPly={moveTo} />
                : (<Stack>
                    <Button onClick={revealAnswer} variant="outlined">
                        手筋を表示
                    </Button>
                    <Box>手数：{moves.length}手</Box>

                </Stack>)
            }
        </Box>
    )
}


