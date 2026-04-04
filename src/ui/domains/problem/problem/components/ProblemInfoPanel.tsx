import type { Problem } from "@/domain/problem/entity/Problem"
import { toProblemViewData } from "@/ui/problem/problemPresenter"
import { Box, Paper, Stack } from "@mui/material"

export function ProblemInfoPanel({problem}: {
    problem: Problem
}){    
    const vd = toProblemViewData(problem)

    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>手合割</Box>
                <Box>{vd.handicapText}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>手数</Box>
                <Box>{ vd.plyLengthText } </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>追加日</Box>
                <Box>{ vd.createdAtText}</Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>更新日</Box>
                <Box> { vd.updatedAtText}</Box>
            </Stack>
        </Stack>
    </Paper>)
}