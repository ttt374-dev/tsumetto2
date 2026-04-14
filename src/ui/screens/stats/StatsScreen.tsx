import { Box, List, ListItem } from "@mui/material";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import PerformaceSummary from "@/ui/screens/stats/components/PerformanceSummary";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { getMasteryStatus, type MasteryStatus } from "@/domain/learning/entity/LearningState";

export function MasterySummary(){
    const records = useLearningRecordStore(s=>s.stateRecords)
    const data: Record<MasteryStatus, number> = {
        "unlearned": 0, "learning": 0, "young": 0, "matured": 0, "relearning": 0,}

    Object.values(records).map(l=>{
        data[getMasteryStatus(l)]++
    })

    return (<>
    <h4>習熟度</h4>
        <List>
            { Object.entries(data).map(([k, v]) => (
            <ListItem>
                {k}: { v}
            </ListItem>    
            ))}
            
        </List>
    </>)
}
export default function StatsScreen() {
    return (
        <AppShell header={"Stats"}>
            <Box sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <ProblemStatsTable />
                    <IntervalDaysStats />
                    <PerformaceSummary/>
                    <MasterySummary/>
                </Box>
            </Box>
        </AppShell>
    )
}