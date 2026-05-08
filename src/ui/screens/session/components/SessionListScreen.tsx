import type { SessionId } from "@/domain/session/entity/Session"
import { routes } from "@/ui/App/useAppNavigation"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"
import SessionListView from "@/ui/screens/session/components/SessionListView"
import { Button, Stack } from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useSessionRouteContext } from "@/ui/screens/session/hooks/useSessionRouteContext"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"


export default function SessionListScreen() {
    const route = useSessionRouteContext()
    const ids = useSessionStore(s => s.problemIds)    
    const navigate = useNavigate()

    const events = useReviewEventStore(s=>s.eventLog)
    const solvedResultMap = getSolvedResultsBySession(events, route.sessionId)

    if (route.result.type === "invalid") return <AppShell>params error</AppShell>

    const { sessionId, index: currentIndex } = route
    const selectedId = ids[currentIndex]

    return (
        <AppShell
            header="Session List"
            footer={<FooterPanel sessionId={sessionId} />}
        >
            <SessionListView
                ids={ids}
                onSelect={(i)=> navigate(routes.sessionPlay(sessionId, i))}
                selectedId={selectedId}
                solvedResultMap={solvedResultMap}
            />
        </AppShell>
    )
}

function FooterPanel({ sessionId }: { sessionId: SessionId }) {
    const navigate = useNavigate()
    return <Stack direction="row">
        <Button variant="outlined" fullWidth onClick={() => navigate(routes.back)}>
            戻る
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate(routes.sessionSummary(sessionId))}>
            サマリーへ
        </Button>
    </Stack>
}

/////////
// helper
// domain / review
export function getSolvedResultsBySession(
    events: ReviewEvent [],
    sessionId: SessionId
): Record<ProblemId, SolvedResult> {
    const result: Record<ProblemId, SolvedResult> = {}

    for (const e of events) {
        if (e.type !== "reviewed") continue
        if (e.sessionId !== sessionId) continue

        result[e.problemId] = e.solvedResult
    }

    return result
}