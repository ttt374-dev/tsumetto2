import { Box } from "@mui/material";
import { AppShell } from "../common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { OverdueStats } from "./components/OverdueStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import { LearningHistory } from "./components/LearningHistory";

export function StatsScreen() {
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
                    <OverdueStats />
                    <LearningHistory/>
                </Box>
            </Box>
        </AppShell>
    )
}