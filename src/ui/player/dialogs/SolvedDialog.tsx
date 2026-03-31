import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { GameEvent } from "@/ui/player/hooks/useGameStore"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

export function SolvedDialog({ open, onClose, onConfirm, events, confirmLabel="次へ" }: {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    events: GameEvent[],
    //solvedResult: SolvedResult
    confirmLabel?: string
}) {
    const solvedResult = deriveSolvedResultFromEvents(events)
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
