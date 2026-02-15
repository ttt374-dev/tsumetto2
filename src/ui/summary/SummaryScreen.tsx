import { Box, Button, Stack } from "@mui/material";
import { AppLayout } from "../common/layout/AppLayout";
import { SummaryView } from "./SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { AppShell } from "../common/layout/AppShell";
import { Navigate, useNavigate } from "react-router-dom";
import { useMissionStore } from "@/application/store/useMissionStore";

/////////////////////////////////////////////
export function SummaryScreen() {
    //console.log("summary scr", missionResultEntryList)
    //const missionStore = useMissionEventStoreContext()

    //if (!missionStore.snapshot) return null

    //const missionResultEntryList = snapshotToResultList(missionStore.snapshot)
    const missionResultEntryList = useMissionStore(s=>s.snapshot.answers)
    console.log("results", missionResultEntryList)

    
    const stats = ProblemStats.createFromMissionResultList(missionResultEntryList)
    console.log("stats", stats)
    const navigate=useNavigate()
    const reset = useMissionStore(s=>s.reset)
    const phase = useMissionStore(s=>s.phase)
    return (
        <AppShell>
            <Box>
                Done. Good Job
            </Box>

            <SummaryView stats={stats}/>

            <Button onClick={()=>{
                    //missionStore.reset()
                    //navigate("/decks")
                    reset()           
                    console.log("summary: reset", phase())
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
