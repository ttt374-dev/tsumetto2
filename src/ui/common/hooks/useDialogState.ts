import { useState } from "react"

export type DialogState = {
    open: boolean
    openDialog: () => void
    closeDialog: () => void
}

export function useDialogState(): DialogState {
    const [open, setIsOpen] = useState(false)

    const openDialog = () => { console.log("open dialog"); setIsOpen(true) }
    const closeDialog = () => { setIsOpen(false) }

    return { open, openDialog, closeDialog }
}