import { MissionSummary, type MissionResultEntry } from "@/domain/MissionEvent/MissionSummary";
import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { SummaryView } from "./SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent";

/////////////////////////////////////////////
export function SummaryScreen() {
    //console.log("summary scr", missionResultEntryList)
    const missionStore = useMissionEventStoreContext()
    if (!missionStore.snapshot) return null

    const missionResultEntryList = snapshotToResultList(missionStore.snapshot)
    const summary = MissionSummary.createFromResultList(missionResultEntryList)
    
    return (
        <AppLayout>
            <Box>
                Done. Good Job
            </Box>

            <SummaryView summary={summary}/>

            <Button onClick={missionStore.reset}>
                Dashboard
            </Button>
        </AppLayout>
    )
}
//////////////////
const snapshotToResultList = (snapshot: MissionSnapshot) => {
    return Object.values(snapshot.answered).map(e => ({
        problemId: e.problemId,
        solvedResult: e.result,
    }))
}
