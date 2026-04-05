
import type { LearningState } from "@/domain/learning/entity/LearningState";
import { Box, Button, Paper, Stack } from "@mui/material";

function SummaryRow({
    label,
    value,
    highlight = false,
}: {
    label: string
    value: React.ReactNode
    highlight?: boolean
}) {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Box>{label}</Box>
            <Box
                sx={{
                    fontWeight: highlight ? "bold" : "normal",
                    fontSize: highlight ? 18 : 14,
                }}
            >
                {value}
            </Box>
        </Stack>
    )
}
export function SummaryView({state}: {
    //stats: ProblemStats,
    state: LearningState
}) {
    
    
    return (
        <Paper>
            <Stack spacing={2} p={2}>
                <SummaryRow label="解答問題数" value={state.attemptCount} />
                <SummaryRow label="失敗" value={state.failedCount} />
                <SummaryRow label="スコア" value={state.score.toFixed(1)} />
            </Stack>
        </Paper>
    )
}