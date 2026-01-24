import { MissionSummary, type MissionResultEntry } from "@/domain/MissionEvent/MissionSummary";
import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/AppLayout";

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
/////////////////////////////////////////////
export function SummaryScreen({ missionResultEntryList, onBackToDashboard: onNavigateToDashboard }: {
    missionResultEntryList: MissionResultEntry[],
    onBackToDashboard: () => void,
}) {
    //console.log("summary scr", missionResultEntryList)
    const summary = MissionSummary.createFromResultList(missionResultEntryList)
    return (
        <AppLayout>
            <Box>
                Done. Good Job
            </Box>

            <Stack spacing={2} p={2}>
                <SummaryRow label="総問題数" value={summary.problemCount} />
                <SummaryRow label="正解" value={summary.solvedCount} />
                <SummaryRow label="不正解" value={summary.failedCount} />
                <SummaryRow label="正解率" value={`${Math.round(summary.accuracy * 100)} %`} />
            </Stack>

            <Button onClick={onNavigateToDashboard}>
                Dashboard
            </Button>
        </AppLayout>
    )
}