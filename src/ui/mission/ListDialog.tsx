import { useProblemStore } from "@/application/store/useProblemStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useMemo, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import type { ProblemId } from "@/domain/problem/Problem"
import { ListView } from "./ListView"

export function useListDialog(id: ProblemId, ids: ProblemId[], onMoveTo: (pid: ProblemId) => void){
    const [open, setOpen] = useState(false)

    const openDialog = () => { setOpen(true)}
    const closeDialog  = () => { setOpen(false)}

    const dialogElement = (
        <ListDialog
                open={open}
                onClose={closeDialog}
                onSelectProblem={(pid) => {
                    onMoveTo(pid),
                    //handlers.navigation.moveTo(pid)
                    closeDialog()
                }}
                problemIds={ids}
                currentProblemId={id}
            />
    )

    return { openDialog, dialogElement}
    

}
export function ListDialog({ problemIds, open, onClose, onSelectProblem, currentProblemId }: {
    problemIds: ProblemId[],
    open: boolean,
    onClose: () => void,
    onSelectProblem: ( id: ProblemId) => void,
    currentProblemId?: ProblemId,
}) {
  const repos = useRepositoryContext()
  const problemStore = useProblemStore(repos.problem)
  //const navigate = useNavigate()

  const problems = useMemo(
    () => problemIds
      .map(id => problemStore.findById(id))
      .filter(p=>p!==undefined),
    [problemIds, problemStore]
  )

  return (
    <Dialog fullScreen open={open} onClose={onClose}
        sx={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        }}
    >
        <DialogTitle>リスト一覧</DialogTitle>
        <DialogContent>
            <ListView problems={problems} 
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
