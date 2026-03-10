import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import { AppShell } from "../common/components/layout/AppShell";
import { useSessionStore } from "@/ui/store/useSessionStore";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import { useLearningEventStore } from "../store/useLearningEventStore";

/////////////////////////////////////////////
export default function SessionSummaryScreen() {
    const sessionId = useSessionStore(s=>s.sessionId)
    const ids = useSessionStore(s=>s.problemIds)
    const learningEventLog = useLearningEventStore(s=>s.eventLog)
    const sessionEventLog = learningEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))      

    const sessionLearningRecords = projectLearning(sessionEventLog)
    const stats = ProblemStats.create(ids, sessionLearningRecords)
    const reset = useSessionStore(s => s.reset)
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
