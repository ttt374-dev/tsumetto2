import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { AppShell } from "../common/layout/AppShell";
import { Navigate, useNavigate } from "react-router-dom";
import { useMissionStore } from "@/ui/store/useMissionStore";

/////////////////////////////////////////////
export function MissionSummaryScreen() {
    const missionResultEntryList = useMissionStore(s => s.answers)
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
                Deck
            </Button>
        </AppShell>
    )
}
