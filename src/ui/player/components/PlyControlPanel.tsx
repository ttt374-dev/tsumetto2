import { Box, Button, Grid, Stack } from "@mui/material"
//////////////////////////////////////////
type PlyControlPanelProps = {
  currentPlyIndex: number
  maxPlyIndex: number
  onPrevPly: () => void
  onNextPly: () => void
  onReset: () => void
}


export function PlyControlPanel({
  currentPlyIndex,
  maxPlyIndex,
  onPrevPly,
  onNextPly,
  onReset,
}: PlyControlPanelProps) {
  return (
    <Box sx={{ border: 1, borderColor: "divider" }}>
      <Stack direction="column" p={1} spacing={1}>
        <Button
          variant="outlined"
          onClick={onPrevPly}
          disabled={currentPlyIndex === 0}
        >
          Ret Ply
        </Button>

        <Button
          variant="contained"
          onClick={onNextPly}
          disabled={currentPlyIndex === maxPlyIndex}
        >
          Adv Ply
        </Button>

        <Button variant="outlined" onClick={onReset}>
          Reset
        </Button>
      </Stack>
    </Box>
  )
}
