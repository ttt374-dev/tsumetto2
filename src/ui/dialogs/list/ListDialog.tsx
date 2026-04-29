import { useMemo, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView"

export function useListDialog(ids: ProblemId[], onSelectProblem: (id: ProblemId) => void) {
    const [open, setOpen] = useState(false)

    const openDialog = () => { setOpen(true) }
    const closeDialog = () => { setOpen(false) }

    const dialogElement = (
        <ListDialog
            ids={ids}
            open={open}
            onClose={closeDialog}     
            onSelectProblem={onSelectProblem}       
        />
    )
    return { openDialog, dialogElement }
}
export function ListDialog({ open, onClose, ids, onSelectProblem}: {
    open: boolean,
    onClose: () => void,
    ids: ProblemId[]
    onSelectProblem: (id: ProblemId) => void,
}) {
    return (
        <Dialog fullScreen open={open} onClose={onClose}
            sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <DialogTitle>リスト一覧</DialogTitle>
            <DialogContent>
                <LibraryListView ids={ids} onItemClick={onSelectProblem}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    戻る
                </Button>
            </DialogActions>

        </Dialog>
    )
}
