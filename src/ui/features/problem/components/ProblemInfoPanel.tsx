import type { Problem } from "@/domain/problem/entity/Problem"
import { problemFieldLabels, toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter"
import { Box, Paper, Stack } from "@mui/material"

export function ProblemInfoPanel({problem}: {
    problem: Problem
}){    
    const vd = toProblemViewData(problem)

    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>{problemFieldLabels["handicap"]}</Box>
                <Box>{vd.handicap}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>{ problemFieldLabels["plyLength"]}</Box>
                <Box>{ vd.plyLength } </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>{ problemFieldLabels["createdAt"] }</Box>
                <Box>{ vd.createdAt}</Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>{ problemFieldLabels["updatedAt"] }</Box>
                <Box> { vd.updatedAt}</Box>
            </Stack>
        </Stack>
    </Paper>)
}