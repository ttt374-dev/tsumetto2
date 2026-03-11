import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import { AppShell } from "../common/components/layout/AppShell";
import { useSessionStore } from "@/ui/store/useSessionStore";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import { useLearningEventStore } from "../store/useLearningEventStore";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

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
    const navigate = useNavigate()

    const startSession = useSessionStore(s=>s.start)
    const handleReview = () => {
        const failedIds = Object.keys(sessionLearningRecords).filter(k=>sessionLearningRecords[k].failedCount>0)
        startSession("REVIEW-ONETIME-SESSION", failedIds)
        navigate(routes.sessionPlay)    
    }

    return (
        <AppShell header={ "Summary"}>
            <Box>
                ミッション完了
            </Box>

            <SummaryView stats={stats} />

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleReview} fullWidth>
                    間違い復習
                </Button>
                <Button variant="contained" fullWidth onClick={() => {
                    reset()
                }}>
                    ミッションリストに戻る
                </Button>
            </Stack>
        </AppShell>
    )
}
