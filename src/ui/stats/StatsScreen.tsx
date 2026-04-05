import { Box } from "@mui/material";

import { AppShell } from "@/ui/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import PerformaceSummary from "@/ui/stats/components/PerformanceSummary";


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

                </Box>
            </Box>
        </AppShell>
    )
}