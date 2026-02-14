import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/layout/AppLayout";
import { SummaryView } from "./SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { AppShell } from "../common/layout/AppShell";
import { Navigate, useNavigate } from "react-router-dom";

/////////////////////////////////////////////
export function SummaryScreen() {
    //console.log("summary scr", missionResultEntryList)
    const missionStore = useMissionEventStoreContext()
    if (!missionStore.snapshot) return null

    const missionResultEntryList = snapshotToResultList(missionStore.snapshot)
    const stats = ProblemStats.createFromMissionResultList(missionResultEntryList)
    const navigate=useNavigate()
    
    return (
        <AppShell>
            <Box>
                Done. Good Job
            </Box>

            <SummaryView stats={stats}/>

            <Button onClick={()=>{
                    //missionStore.reset()
                    navigate("/decks")
                }}>
                Dashboard
            </Button>
        </AppShell>
    )
}
//////////////////
const snapshotToResultList = (snapshot: MissionSnapshot) => {
    return Object.values(snapshot.answered).map(e => ({
        problemId: e.problemId,
        solvedResult: e.result,
    }))
}
