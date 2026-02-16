import { useMemo, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import type { ProblemId } from "@/domain/problem/Problem"
import { ListView } from "./ListView"
import { useProblemStore } from "@/application/store/useProblemStore"

export function useListDialog(id: ProblemId, onMoveTo: (pid: ProblemId) => void) {
    const [open, setOpen] = useState(false)

    const openDialog = () => { setOpen(true) }
    const closeDialog = () => { setOpen(false) }

    const dialogElement = (
        <ListDialog
            open={open}
            onClose={closeDialog}
            onSelectProblem={(pid) => {
                onMoveTo(pid),
                    //handlers.navigation.moveTo(pid)
                    closeDialog()
            }}
            currentProblemId={id}
        />
    )

    return { openDialog, dialogElement }


}
export function ListDialog({ open, onClose, onSelectProblem, currentProblemId }: {
    open: boolean,
    onClose: () => void,
    onSelectProblem: (id: ProblemId) => void,
    currentProblemId?: ProblemId,
}) {
    const problemIds = useProblemStore(s=>s.ids)

    return (
        <Dialog fullScreen open={open} onClose={onClose}
            sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <DialogTitle>リスト一覧</DialogTitle>
            <DialogContent>
                <ListView ids={problemIds}
                    currentProblemId={currentProblemId}
                    onSelectProblem={onSelectProblem} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    戻る
                </Button>
            </DialogActions>

        </Dialog>
    )
}
