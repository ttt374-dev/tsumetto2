import { Box, List, ListItem } from "@mui/material";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import PerformaceSummary from "@/ui/screens/stats/components/PerformanceSummary";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import type { MasteryLevel } from "@/domain/learning/entity/LearningState";

export function MasterySummary(){
    const records = useLearningRecordStore(s=>s.stateRecords)
    const data: Record<MasteryLevel, number> = {"unlearned": 0, "learning": 0, "mastered": 0}

    Object.values(records).map(l=>{
        data[l.masteryLevel]++
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