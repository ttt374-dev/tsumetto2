import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material"
import { useState } from "react"

type CreateDeckDialogProps = {
  open: boolean
  onCreate: (name: string) => void
  onClose: () => void
}

export function CreateDeckDialog({
  open,
  onCreate,
  onClose,
}: CreateDeckDialogProps) {
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate(name.trim())
    setName("")
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新規プリセット</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="プリセット名"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleCreate} disabled={name===""}>
          作成
        </Button>
      </DialogActions>
    </Dialog>
  )
}
