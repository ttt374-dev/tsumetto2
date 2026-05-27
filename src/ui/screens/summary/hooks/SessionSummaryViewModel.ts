import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { computeStatsSummary } from "@/domain/learning/service/computeLearningSummary";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/store/usePlannerStore";
import type { SessionId } from "@/domain/session/entity/Session";
import type { StatsSummary } from "@/domain/learning/entity/StatsSummary";
import type { SessionIdContext as SessionIdRouteContext } from "@/ui/screens/summary/SessionSummaryScreen";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { ReviewEventLog } from "@/domain/review/types/ReviewEvent";

export type SessionSummaryViewModel = 
    | { type: "error", message: string}
    | { type: "ready", 
        summary: StatsSummary,
        disableReview: boolean,
        disableNextChunk: boolean
    }
type SessionSummaryInput = {
    activeSessionId: SessionId | undefined
    ids: ProblemId[]
    reviewEventLog: ReviewEventLog
    route: SessionIdRouteContext
    hasNext: () => boolean    
}
export function useSessionSummaryViewModel(route: SessionIdRouteContext ): SessionSummaryViewModel {
    const input: SessionSummaryInput = {
        route,
        activeSessionId: useSessionStore(s=>s.activeSessionId),
        ids: useSessionStore(s => s.problemIds),
        hasNext:  usePlannerStore(s=>s.hasNext),
        reviewEventLog: useReviewEventStore(s => s.eventLog)
    }
    return buildSessionSummaryViewModel(input)   
}
/////////////
function buildSessionSummaryViewModel(input: SessionSummaryInput): SessionSummaryViewModel {
    const { activeSessionId, ids, reviewEventLog, route, hasNext } = input

    if (route.result.type === "invalid")
        return { type: "error", message: "invalid sessionid"}
    if (activeSessionId !== route.sessionId)
        return { type: "error", message: `session expired: ${route.sessionId} vs active: ${activeSessionId}`}
     // --- domain projection ---
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === route.sessionId))

    const records = projectLearningState(sessionEventLog)
    const summary = computeStatsSummary(ids, records)

    return {
        type: "ready",
        summary,

        disableReview: summary.failedCount === 0,
        disableNextChunk: !hasNext(),
    }
}