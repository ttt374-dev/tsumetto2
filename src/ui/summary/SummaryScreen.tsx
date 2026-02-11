import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { SummaryView } from "./SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent";
import { ProblemStats } from "@/domain/problem/ProblemStats";

/////////////////////////////////////////////
export function SummaryScreen() {
    //console.log("summary scr", missionResultEntryList)
    const missionStore = useMissionEventStoreContext()
    if (!missionStore.snapshot) return null

    const missionResultEntryList = snapshotToResultList(missionStore.snapshot)
    const stats = ProblemStats.createFromMissionResultList(missionResultEntryList)
    
    return (
        <AppLayout>
            <Box>
                Done. Good Job
            </Box>

            <SummaryView summary={stats}/>

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
