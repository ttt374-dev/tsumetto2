import { useNavigate } from "react-router-dom";

import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";
import { routes } from "@/ui/App/useAppNavigation";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { computeStatsSummary } from "@/domain/learning/service/computeLearningSummary";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/store/usePlannerStore";
import type { SessionId } from "@/domain/session/entity/Session";


export function useSessionSummaryViewModel(sessionId: SessionId) {
    const ids = useSessionStore(s => s.problemIds)
    const planner = usePlannerStore()
    const reviewEventLog = useReviewEventStore(s => s.eventLog)

    // --- domain projection ---
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))

    const records = projectLearningState(sessionEventLog)
    const summary = computeStatsSummary(ids, records)


    return {
        summary,

        disableReview: summary.failedCount === 0,
        disableNextChunk: !planner.hasNext(),
    }
}