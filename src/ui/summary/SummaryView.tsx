
import { MissionSummary, type MissionResultEntry } from "@/domain/MissionEvent/MissionSummary";
import { Box, Button, Stack } from "@mui/material";

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
    summary: MissionSummary
}){
    return (
        <Stack spacing={2} p={2}>
            <SummaryRow label="総問題数" value={summary.problemCount} />
            <SummaryRow label="正解" value={summary.solvedCount} />
            <SummaryRow label="不正解" value={summary.failedCount} />
            <SummaryRow label="正解率" value={`${Math.round(summary.accuracy * 100)} %`} />
        </Stack>
    )
}