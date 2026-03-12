import { Box, Button, Stack } from "@mui/material";
import MovesView from "../views/MovesView";
import type { Move } from "@/domain/kif/entity";


export default function MovesPanel(props: {
    revealed: boolean
    onMoveToPly: (ply: number) => void
    moves: Move[]
    ply: number
    onRevealAnswer: () => void
}) {
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
            {props.revealed ?
                <MovesView moves={props.moves} currentPlyIndex={props.ply} onMoveToPly={props.onMoveToPly} />
                : (<Stack>
                    <Button onClick={props.onRevealAnswer} variant="outlined">
                        手筋を表示
                    </Button>

                </Stack>)
            }
        </Box>
    )
}


