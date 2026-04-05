import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow"

import { Box, Button, Stack } from "@mui/material";
import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/layout/AppShell";
import { useSessionStore } from "@/ui/session/hooks/useSessionStore";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { projectLearning } from "@/domain/learning/service/projectionLearning";
import { useReviewEventStore } from "../store/useReviewEventStore";
import { routes } from "../App/useAppNavigation";

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

    const sessionLearningRecords = projectLearning(sessionEventLog)
    const stats = ProblemStats.create(ids, sessionLearningRecords)

    const navigate = useNavigate()
    const createOnetimeSessionId = () => 
        `REVIEW-ONETIME-SESSION-${v4()}`
    const handleReview = () => {
        const failedIds = Object.keys(sessionLearningRecords).filter(k => sessionLearningRecords[k].failedCount > 0)
        startSession(createOnetimeSessionId(), failedIds)
        navigate(routes.sessionPlay)
    }
    const handleRetry = () => {        
        startSession(createOnetimeSessionId(), ids)
        navigate(routes.sessionPlay)
    }

    return (
        <AppShell header={"Summary"}>
            <Box>
                ミッション完了
            </Box>

            <SummaryView stats={stats} />

            <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleRetry} fullWidth>
                    再挑戦
                </Button>
                
                <Button variant="outlined" onClick={handleReview} fullWidth
                    disabled={stats.failedCount === 0}
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
