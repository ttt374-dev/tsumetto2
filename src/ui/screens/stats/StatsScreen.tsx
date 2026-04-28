import { Box } from "@mui/material";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { ProblemStatsTable } from "./components/ProblemStatsTable";
import PerformaceSummary from "@/ui/screens/stats/components/PerformanceSummary";
import { MasterySummary } from "@/ui/screens/stats/components/MasterySummary";
import { NextReviewStats } from "@/ui/screens/stats/components/NextReviewStats";
import FooterNavigation from "@/ui/common/components/FooterNavigation";

export default function StatsScreen() {
    return (
        <AppShell header={"Stats"}
            footer={<FooterNavigation/>}
        >
            <Box sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                    <ProblemStatsTable />
                    <NextReviewStats/>
                    <PerformaceSummary/>
                    <MasterySummary/>
                </Box>
            </Box>
        </AppShell>
    )
}