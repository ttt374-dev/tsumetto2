import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"

import { deriveAnswerQuality } from "@/domain/learning/entity/AnswerQuality"
import type { LearningState } from "@/domain/learning/entity/LearningState"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { toSolvedResultViewData } from "@/ui/features/learning/hooks/solvedResultPresenter"
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter"

type SolvedDialogState = 
    | { open: false }
    | { open: true, solvedResult: SolvedResult, problemId: ProblemId}

type SolvedDialogActions = {
    openDialog: (pid: ProblemId, solvedResult: SolvedResult) => void
    closeDialog: () => void
}
export function useSolvedDialogController(): SolvedDialogState & SolvedDialogActions {
    const [state, setState] = useState<SolvedDialogState>({ open: false })    

    const openDialog = (pid: ProblemId, solvedResult: SolvedResult) => { 
        setState({
            open: true,
            solvedResult,
            problemId: pid
        })
    }
    const closeDialog = () => { setState({ open: false }) }
    
    return { ...state,
        openDialog, closeDialog}
}

export function SolvedDialog({ open, onClose, onConfirm, solvedResult, learningState }: {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    solvedResult: SolvedResult
    learningState: LearningState | undefined
    
}) {

    const confirmLabel = "確認"
    const text = formatSolvedResult(solvedResult)
    const learningtext = learningState ? formatLearningState(learningState) : ""

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" 
           sx={{
    //            mt: 24,
    /*"& .MuiDialog-container": {
      alignItems: "flex-end",
      paddingBottom: "96px",
    },*/
  }}
        >
            <DialogTitle>
                詰みました
            </DialogTitle>
            <DialogContent>
                <Box>{ text }</Box>
                <Box>{ learningtext }</Box>                
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="info" onClick={() => { onClose() }}>
                    閉じる
                </Button>
                <Button variant="contained" color="primary" 
                    onClick={() => { onConfirm();}}>
                    { confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
function formatSolvedResult(res: SolvedResult): string {
    const quality = deriveAnswerQuality(res)
    const vd = toSolvedResultViewData(res)
    return `${vd.outcome} (${quality}: ${vd.mistakes}, ${vd.isRevealed}, ${vd.elapsedSec})`
}
function formatLearningState(state: LearningState){
    const vd = toLearningStateViewData(state)
    return `平均スコア: ${vd.score}, 次回レビュー：${vd.nextReviewedIn}`
}


