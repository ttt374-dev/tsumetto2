
import type { LearningSummary } from "@/domain/learning/entity/LearningSummary";
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
export function SummaryView({summary}: {    
    summary: LearningSummary
}) {       
    return (
        <Paper>
            <Stack spacing={2} p={2}>
                <SummaryRow label="解答問題数" value={summary.attemptCount} />
                <SummaryRow label="失敗" value={summary.failedCount} />
                <SummaryRow label="スコア" value={summary.avgScore.toFixed(1)} />
            </Stack>
        </Paper>
    )
}