import { Button, Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { DialogContent } from "@mui/material"

import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";
import SessionListView from "@/ui/screens/session/components/SessionListView";
import type { SessionId } from "@/domain/session/entity/Session";
import type { ReviewEvent } from "@/domain/review/ReviewEvent";
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";

export default function SessionProblemListDialog(props: {
    open: boolean
    onClose: () => void
    selectedProblemId: ProblemId
    sessionId: SessionId
    //solvedResultMap: Record<ProblemId, SolvedResult>

}){    
    //const moveTo = useSessionStore(s=>s.moveTo)
    const moveTo = (index: number) => {} // TODO
    const problemIds = useSessionStore(s => s.problemIds)

    const navigate = useNavigate()

    const navigateToSummary = () => {
        navigate(routes.sessionSummary(props.sessionId))
    }

    const handleOnSelect = (index: number) => {        
        props.onClose()
        moveTo(index)
    }
    const events = useReviewEventStore(s=>s.eventLog)
    const solvedResultMap = getSolvedResultsBySession(events, props.sessionId)
    
    return (
        <Dialog open={props.open} onClose={props.onClose} fullScreen
            sx={{ 
                pt: "calc(env(safe-area-inset-bottom) + 16px)",
                pb: "calc(env(safe-area-inset-top) + 16px)"
            }}
            >
            <DialogTitle>問題リスト</DialogTitle>
            <DialogContent sx={{p: 0}}>
                <SessionListView ids={problemIds}
                    onSelect={handleOnSelect}
                    selectedId={props.selectedProblemId}
                    solvedResultMap={solvedResultMap}
                />
            </DialogContent>
            <DialogActions sx={{ p: 0, width: "100%", display: "flex" }}>
                <Button onClick={props.onClose} fullWidth variant="contained">
                    戻る
                </Button>
                <Button onClick={navigateToSummary} fullWidth variant="outlined">
                    サマリーへ
                </Button>
            </DialogActions>
        </Dialog>
    )

}
/////////
// helper
// domain / review
export function getSolvedResultsBySession(
    events: ReviewEvent[],
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