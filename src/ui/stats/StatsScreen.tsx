import { Box } from "@mui/material";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";

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
                </Box>
            </Box>
        </AppShell>
    )
}