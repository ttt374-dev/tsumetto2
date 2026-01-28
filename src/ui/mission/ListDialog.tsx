import { useProblemStore } from "@/application/store/useProblemStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useMemo } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import type { ProblemId } from "@/domain/problem/Problem"
import { ListView } from "./ListView"
import { useNavigate } from "react-router-dom"

export function ListDialog({ problemIds, open, onClose }: {
    problemIds: ProblemId[],
    open: boolean,
    onClose: () => void,
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
            paddingBottom: 'env(safe-area-inset-buttom)',
        }}
    >
        <DialogTitle>リスト一覧</DialogTitle>
        <DialogContent>
            <ListView problems={problems} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>
                戻る
            </Button>
        </DialogActions>
      
    </Dialog>
  )
}
