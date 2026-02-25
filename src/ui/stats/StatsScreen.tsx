import { AppShell } from "../common/components/layout/AppShell";
import { IntervalDaysStats } from "./components/IntervalDaysStats";
import { OverdueStats } from "./components/OverdueStats";
import { ProblemStatsTable } from "./components/ProblemStatsTable";

export function StatsScreen() {    
    return (
        <AppShell header={"Stats"}>
            <ProblemStatsTable/>
            <IntervalDaysStats/>
            <OverdueStats/>
        </AppShell>
    )
}