import { Box, Button, Stack } from "@mui/material"
//////////////////////////////////////////
type PlyControlPanelProps = {
    currentPly: number
    maxPly: number
    onPrev: () => void
    onNext: () => void
}


export default function PlyControlPanel({
    currentPly,
    maxPly,
    onPrev,
    onNext,
    //onReset,
}: PlyControlPanelProps) {
    return (
        <Box sx={{ border: 1, borderColor: "divider" }}>
            <Stack direction="column" p={1} spacing={1}>
                <Button
                    variant="outlined"
                    onClick={onPrev}
                    disabled={currentPly === 0}
                >
                    ↑前の手
                </Button>

                <Button
                    variant="contained"
                    onClick={onNext}
                    disabled={currentPly === maxPly}
                >
                    ↓次の手
                </Button>
            </Stack>
        </Box>
    )
}
