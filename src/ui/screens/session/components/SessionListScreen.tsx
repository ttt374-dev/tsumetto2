import { useNavigate } from "react-router-dom"
import { Button, Stack } from "@mui/material"

import type { SessionId } from "@/domain/session/entity/Session"
import { routePaths } from "@/router/paths"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"
import SessionListView from "@/ui/screens/session/components/SessionListView"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/types/solvedResult"
import type { ReviewEvent } from "@/domain/review/types/ReviewEvent"
import { useSessionRouteContext } from "@/ui/screens/session/hooks/useSessionRouteContext"

export default function SessionListScreen() {
    const resParams = useSessionRouteContext()
    if (resParams.type === "invalid") return <AppShell>params error: {resParams.message}</AppShell>

    return <SessionListContent sessionId={resParams.sessionId} index={resParams.index} />
}
function SessionListContent(props: {
    sessionId: string
    index: number
}){
    const { sessionId, index} = props
    const ids = useSessionStore(s => s.problemIds)    
    const navigate = useNavigate()
    const events = useReviewEventStore(s=>s.eventLog)        

    const solvedResultMap = getSolvedResultsBySession(events, sessionId)    
    const selectedId = ids[index]

    return (
        <AppShell
            header="Session List"
            footer={<FooterPanel sessionId={sessionId} />}
        >
            <SessionListView
                ids={ids}
                onSelect={(i)=> navigate(routePaths.sessionPlay.build(sessionId, i))}
                selectedId={selectedId}
                solvedResultMap={solvedResultMap}
            />
        </AppShell>
    )
}

function FooterPanel({ sessionId }: { sessionId: SessionId }) {
    const navigate = useNavigate()
    return <Stack direction="row">
        <Button variant="outlined" fullWidth onClick={() => navigate(-1)}>
            戻る
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate(routePaths.sessionSummary.build(sessionId))}>
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