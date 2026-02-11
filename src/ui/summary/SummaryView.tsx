
import type { ProblemStats } from "@/domain/problem/ProblemStats";
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
export function SummaryView({ stats }: {
    stats: ProblemStats,
}) {
    return (
        <Paper>
            <Stack spacing={2} p={2}>
                <SummaryRow label="総問題数" value={stats.problemCount} />
                <SummaryRow label="正解" value={stats.solvedCount} />
                <SummaryRow label="不正解" value={stats.failedCount} />
                <SummaryRow label="正解率" value={`${Math.round(stats.accuracy * 100)} %`} />
            </Stack>
        </Paper>
    )
}