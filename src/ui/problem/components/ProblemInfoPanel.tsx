import type { Problem } from "@/domain/problem/entity/Problem"
import { problemPresenter } from "@/ui/presenter/problemPresenter"
import { Box, Paper, Stack } from "@mui/material"

export function ProblemInfoPanel({problem}: {
    problem: Problem
}){
    const pp = problemPresenter

    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>手合割</Box>
                <Box>{problem.kifData.headers["手合割"]}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box> { pp.plyLength.label}</Box>
                <Box>{ pp.plyLength.getText(problem) } </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>{ pp.createdAt.label}</Box>
                <Box>{ pp.createdAt.getText(problem)}</Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box> { pp.updatedAt.label} </Box>
                <Box> { pp.updatedAt.getText(problem)}</Box>
            </Stack>
        </Stack>
    </Paper>)
}