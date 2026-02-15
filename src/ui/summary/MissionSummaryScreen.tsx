import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { AppShell } from "../common/layout/AppShell";
import { Navigate, useNavigate } from "react-router-dom";
import { useMissionStore } from "@/application/store/useMissionStore";

/////////////////////////////////////////////
export function MissionSummaryScreen() {
    const missionResultEntryList = useMissionStore(s => s.snapshot.answers)
    const stats = ProblemStats.createFromMissionResultList(missionResultEntryList)
    //console.log("stats", stats)
    const reset = useMissionStore(s => s.reset)
//    const phase = useMissionStore(s => s.phase)
    return (
        <AppShell>
            <Box>
                Done. Good Job
            </Box>

            <SummaryView stats={stats} />

            <Button onClick={() => {
                reset()
                //console.log("summary: reset", phase())
            }}>
                Dashboard
            </Button>
        </AppShell>
    )
}
