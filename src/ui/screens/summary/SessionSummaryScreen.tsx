import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";

import { SummaryView } from "./SummaryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";
import { routes } from "@/ui/App/useAppNavigation";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { computeStatsSummary } from "@/domain/learning/service/computeLearningSummary";
import { createSessionId, useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/hooks/usePlannerStore";
import type { SessionId } from "@/domain/session/entity/Session";

/////////////////////////////////////////////
export default function SessionSummaryScreen() {
    const { sessionId } = useParams<{ sessionId: string }>()    
    if (!sessionId) return <AppShell>No sessionId available</AppShell>
    return <SessionSummaryContent sessionId={sessionId}/>
}

function SessionSummaryContent({sessionId}: { sessionId: SessionId}){
    const ids = useSessionStore(s=>s.problemIds)
    const startSession = useSessionStore(s=>s.start)
    
    const planner = usePlannerStore()
    const reviewEventLog = useReviewEventStore(s => s.eventLog)
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))
    const sessionLearningRecords = projectLearningState(sessionEventLog)

    const navigate = useNavigate()
    const handleReview = () => {
        const failedIds = Object.keys(sessionLearningRecords).filter(k => sessionLearningRecords[k].stats.failedCount > 0)
        const newSessionId = createSessionId()
        startSession(newSessionId, failedIds)
        navigate(routes.sessionPlay(newSessionId))
    }
    const handleRetry = () => {    
        const newSessionId = createSessionId()    
        startSession(newSessionId, ids)
        navigate(routes.sessionPlay(sessionId))
    }
    const handleNextChunk = () => {
        const chunk = planner.nextChunk()
        planner.missionId&& chunk && startSession(planner.missionId, chunk)
        const newSessionId = createSessionId()
        navigate(routes.sessionPlay(newSessionId))
    }
    const records = projectLearningState(sessionEventLog)
    const summary = computeStatsSummary(ids, records)

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

                <Button variant="contained" onClick={handleNextChunk} fullWidth
                    disabled={!planner.hasNext()}
                >
                    次のチャンクへ
                </Button>
                <Button variant="outlined" fullWidth onClick={() => {
                    navigate(routes.mission)
                }}>
                    ミッションへ
                </Button>
            </Stack>
        </AppShell>
    )
}
