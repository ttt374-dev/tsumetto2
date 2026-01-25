import { MissionSummary, type MissionResultEntry } from "@/domain/MissionEvent/MissionSummary";
import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { SummaryView } from "./SummaryView";

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

            <SummaryView summary={summary}/>

            <Button onClick={onNavigateToDashboard}>
                Dashboard
            </Button>
        </AppLayout>
    )
}