import { MissionSummary, type MissionResultEntry } from "@/domain/mission/MissionSummary";
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
/////////////////////////////////////////////
export function SummaryScreen({ missionResultEntryList, onNavigateToDashboard }: {
    missionResultEntryList: MissionResultEntry[],
    onNavigateToDashboard: () => void,
}) {
    //console.log("summary scr", missionResultEntryList)
    const summary = MissionSummary.create(missionResultEntryList)
    return (
        <>
            <Box>
                Done. Good Job
            </Box>

            <Stack spacing={2} p={2}>
                <SummaryRow label="正解" value={summary.solvedCount} />
                <SummaryRow label="不正解" value={summary.failedCount} />
                <SummaryRow label="正解率" value={`${Math.round(summary.accuracy * 100)} %`} />
            </Stack>

            <Button onClick={onNavigateToDashboard}>
                Dashboard
            </Button>
        </>
    )
}