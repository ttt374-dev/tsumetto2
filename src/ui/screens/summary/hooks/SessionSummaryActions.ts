import { useNavigate } from "react-router-dom";

import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";
import { routePaths } from "@/router/paths";
import { projectLearningState } from "@/domain/learning/service/projectLearningState";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { usePlannerStore } from "@/ui/screens/session/store/usePlannerStore";
import type { SessionId } from "@/domain/session/entity/Session";
import type { ProblemId } from "@/domain/problem/entity/Problem";

export function useSessionSummaryActions(sessionId: SessionId) {
    const problemIds = useSessionStore(s => s.problemIds)
    const startSession = useSessionStore(s => s.start)
    const missionId = useSessionStore(s=>s.missionId)

    const planner = usePlannerStore()
    const reviewEventLog = useReviewEventStore(s => s.eventLog)

    // --- domain projection ---
    const sessionEventLog = reviewEventLog
        .filter(e => ("sessionId" in e && e.sessionId === sessionId))

    const records = projectLearningState(sessionEventLog)
    const navigate = useNavigate()
    
    // --- actions ---
    const review = () => {
        const failedIds = Object.keys(records)
            .filter(k => records[k].stats.failedCount > 0)
        goSession(failedIds)        
    }

    const retry = () => {
        goSession(problemIds)        
    }

    const nextChunk = () => {
        const chunk = planner.nextChunk()
        if (!planner.missionId || !chunk) return
        goSession(chunk)        
    }

    const backToMission = () => {
        navigate(routePaths.mission)
    }
    
    function goSession(ids: ProblemId[]){
        const newSessionId = createSessionId()
        startSession(newSessionId, ids, missionId)
        navigate(routePaths.sessionPlay.build(newSessionId))
    }
    return {
        navigation: {
            review, retry, nextChunk, backToMission
        }
    }
}