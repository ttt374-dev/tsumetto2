import type { Problem } from "@/domain/problem/entity/Problem"
import { Divider, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow";



export function ProblemInfoPanel({problem}: {
    problem: Problem
}){
    return (<Paper sx={{ p: 1 }}>
        <Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>手合割</Box>
                <Box>{problem.kifData.headers["手合割"]}</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>手数</Box>
                <Box>{problem.kifData.moves.length}手</Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
                <Box>追加日</Box>
                <Box>{new Date(problem.createdAt).toLocaleString()}</Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Box>更新日</Box>
                <Box>{new Date(problem.updatedAt).toLocaleString()}</Box>
            </Stack>
        </Stack>
    </Paper>)
}