import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import { AppShell } from "../common/components/layout/AppShell";
import { useMissionStore } from "@/ui/store/useMissionStore";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import { useLearningEventStore } from "../store/useLearningEventStore";

/////////////////////////////////////////////
export function MissionSummaryScreen() {
    const missionId = useMissionStore(s=>s.missionId)
    const ids = useMissionStore(s=>s.problemIds)
    const learningEventLog = useLearningEventStore(s=>s.eventLog)
    const missionEventLog = learningEventLog
        .filter(e => ("missionId" in e && e.missionId === missionId))      

    const missionLearningRecords = projectLearning(missionEventLog)
    const stats = ProblemStats.create(ids, missionLearningRecords)
    const reset = useMissionStore(s => s.reset)
    return (
        <AppShell header={ "Summary"}>
            <Box>
                ミッション完了
            </Box>

            <SummaryView stats={stats} />

            <Button variant="outlined" onClick={() => {
                reset()
                //console.log("summary: reset", phase())
            }}>
                デッキに戻る
            </Button>
        </AppShell>
    )
}
