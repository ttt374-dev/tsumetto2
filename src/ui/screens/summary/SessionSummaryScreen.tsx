import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow"
import { Box, Button, Stack } from "@mui/material";

import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useReviewEventStore } from "../../features/learning/hooks/useReviewEventStore";
import { routes } from "../../App/useAppNavigation";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { computeLearningSummary } from "@/domain/learning/service/computeLearningSummary";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";

/////////////////////////////////////////////
export default function SessionSummaryScreen() {
    const { sessionId, ids, reset, startSession } =
        useSessionStore(useShallow(s => ({
            sessionId: s.sessionId,
            ids: s.problemIds,
            reset: s.reset,
            startSession: s.start
        })))

    const reviewEventLog = useReviewEventStore(s => s.eventLog)
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))

    const sessionLearningRecords = projectLearningState(sessionEventLog)

    const navigate = useNavigate()
    const createOnetimeSessionId = () => 
        `REVIEW-ONETIME-SESSION-${v4()}`
    const handleReview = () => {
        const failedIds = Object.keys(sessionLearningRecords).filter(k => sessionLearningRecords[k].stats.failedCount > 0)
        startSession(createOnetimeSessionId(), failedIds)
        navigate(routes.sessionPlay)
    }
    const handleRetry = () => {        
        startSession(createOnetimeSessionId(), ids)
        navigate(routes.sessionPlay)
    }
    const records = projectLearningState(sessionEventLog)
    const summary = computeLearningSummary(ids, records)

    return (
        <AppShell header={"Summary"}>
            <Box>
                ミッション完了
            </Box>

            <SummaryView summary={summary} />

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleRetry} fullWidth>
                    再挑戦
                </Button>
                
                <Button variant="outlined" onClick={handleReview} fullWidth
                    disabled={summary.failedCount === 0}
                >
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
