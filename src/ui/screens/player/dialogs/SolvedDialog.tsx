import { deriveAnswerQuality } from "@/domain/learning/entity/AnswerQuality"
import type { LearningState } from "@/domain/learning/entity/LearningState"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { learningStateLabels, toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter"
import { solvedResultLabels, toSolvedResultViewData } from "@/ui/features/learning/hooks/solvedResultPresenter"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

export function SolvedDialog({ open, onClose, onConfirm, solvedResult, learning }: {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    solvedResult: SolvedResult
    learning: LearningState | undefined
    
}) {
    const confirmLabel = "確認"
    const svd = toSolvedResultViewData(solvedResult)
    const lvd = learning && toLearningStateViewData(learning)
    const quality = deriveAnswerQuality(solvedResult)
    const pdata = ["outcome", "mistakes", "isRevealed", "elapsedSec"] as const
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl">
            <DialogTitle>
                詰みました
            </DialogTitle>
            <DialogContent>
                { pdata.map(d=>(
                    <Box>{ solvedResultLabels[d]}：{svd[d]}</Box>    
                ))}                

                {lvd && <>
                    <Box>平均スコア：{lvd.score}</Box>
                    <Box>{ learningStateLabels["nextReviewedAt"]}：{lvd.nextReviewedIn}</Box>
                    <Box>Answer Quality：{quality}</Box>
                </>
                }
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="info" onClick={() => { onClose() }}>
                    閉じる
                </Button>
                <Button variant="contained" color="primary" 
                    onClick={() => { onConfirm(); onClose() }}>
                    { confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

