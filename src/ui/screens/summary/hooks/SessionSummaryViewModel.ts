import { useNavigate } from "react-router-dom";

import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";
import { routes } from "@/ui/App/useAppNavigation";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { computeStatsSummary } from "@/domain/learning/service/computeLearningSummary";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/store/usePlannerStore";
import type { SessionId } from "@/domain/session/entity/Session";


export function useSessionSummaryViewModel(sessionId: SessionId) {
    const navigate = useNavigate()

    const ids = useSessionStore(s => s.problemIds)
    const startSession = useSessionStore(s => s.start)
    const missionId = useSessionStore(s=>s.missionId)

    const planner = usePlannerStore()
    const reviewEventLog = useReviewEventStore(s => s.eventLog)

    // --- domain projection ---
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))

    const records = projectLearningState(sessionEventLog)
    const summary = computeStatsSummary(ids, records)

    // --- actions ---
    const onReview = () => {
        const failedIds = Object.keys(records)
            .filter(k => records[k].stats.failedCount > 0)

        const newSessionId = createSessionId()
        startSession(missionId, failedIds)
        navigate(routes.sessionPlay(newSessionId))
    }

    const onRetry = () => {
        const newSessionId = createSessionId()
        startSession(missionId, ids)
        navigate(routes.sessionPlay(newSessionId))
    }

    const onNextChunk = () => {
        const chunk = planner.nextChunk()
        if (!planner.missionId || !chunk) return

        const newSessionId = createSessionId()
        startSession(missionId, chunk)
        navigate(routes.sessionPlay(newSessionId))
    }

    const onBackToMission = () => {
        navigate(routes.mission)
    }

    return {
        summary,

        onReview,
        onRetry,
        onNextChunk,
        onBackToMission,

        disableReview: summary.failedCount === 0,
        disableNextChunk: !planner.hasNext(),
    }
}