import { Button, Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { DialogContent } from "@mui/material"

import SessionListView from "@/ui/session/SessionListView";

import { useSessionStore } from "@/ui/session/hooks/useSessionStore";
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SolvedResult } from "@/domain/review/solvedResult";

export default function SessionProblemListDialog(props: {
    open: boolean
    onClose: () => void
    selectedProblemId: ProblemId
    //sessionId: SessionId
    solvedResultMap: Record<ProblemId, SolvedResult>

}){    
    const moveTo = useSessionStore(s=>s.moveTo)
    const problemIds = useSessionStore(s => s.problemIds)

    const navigate = useNavigate()

    const navigateToSummary = () => {
        navigate(routes.sessionSummary)
    }

    const handleOnSelect = (index: number) => {        
        props.onClose()
        moveTo(index)
    }
    
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
                    solvedResultMap={props.solvedResultMap}
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