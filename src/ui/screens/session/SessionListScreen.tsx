import type { SessionId } from "@/domain/session/entity/Session"
import { routes } from "@/ui/App/useAppNavigation"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import SessionListView from "@/ui/screens/session/SessionListView"
import { getSolvedResultsBySession } from "@/ui/screens/session/SessionProblemListDialog"
import { Button, Stack } from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"


export default function SessionListScreen() {
    const { sessionId, index } = useParams<{ sessionId: string, index: string }>()
    const currentIndex = Number(index??0)
    if (!sessionId) throw new Error("invalid sessionId")

    const ids = useSessionStore(s => s.problemIds)
    const selectedId = ids[currentIndex]
    const navigate = useNavigate()

    const events = useReviewEventStore(s=>s.eventLog)
    const solvedResultMap = getSolvedResultsBySession(events, sessionId)
    return (
        <AppShell
            header="Session List"
            footer={<FooterPanel sessionId={sessionId} />}
        >
            <SessionListView
                ids={ids}
                onSelect={(index)=> navigate(routes.sessionPlay(sessionId, index))}
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