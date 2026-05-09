import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from "@mui/material"
import { useState } from "react"

type Props = {
    open: boolean
    initialValue?: string
    onClose: () => void
    onSubmit: (value: string) => void
}

export function SaveAsMissionDialog({
    open,
    initialValue = "",
    onClose,
    onSubmit,
}: Props) {
    const [value, setValue] = useState(initialValue)

    const handleSubmit = () => {
        onSubmit(value)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>ミッションとして保存</DialogTitle>

            <DialogContent>
                ミッション名：
                <TextField
                    autoFocus
                    fullWidth
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button onClick={handleSubmit} variant="contained">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}