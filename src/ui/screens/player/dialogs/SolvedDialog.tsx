import type { LearningState } from "@/domain/learning/entity/LearningState"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { formatDuration } from "@/ui/common/formatter"
import type { GameEvent } from "@/ui/screens/player/store/useGameStore"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

export function SolvedDialog({ open, onClose, onConfirm, solvedResult, learning }: {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    solvedResult: SolvedResult
    learning: LearningState | undefined
    
}) {
    //console.log("learning", learning)
    const confirmLabel = "確認"
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl">
            <DialogTitle>
                詰みました
            </DialogTitle>
            <DialogContent>
                <Box>結果：{solvedResult.outcome}</Box>
                <Box>間違い回数：{solvedResult.mistakes}</Box>
                <Box>解答参照：{solvedResult.isRevealed ? "参照" : "なし"}</Box>
                <Box>秒数: {solvedResult.elapsedSec}</Box>

                {learning && <>
                    <Box>平均スコア：{learning.score.toFixed(1)}</Box>
                    <Box>次レビュー：{formatDuration(learning.nextReviewedAt - Date.now())}</Box>
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

