import { useState } from "react"

export function useDialogState(){
    const [open, setIsOpen] = useState(false)

    const openDialog = () => { console.log("open dialog"); setIsOpen(true) }
    const closeDialog = () => { setIsOpen(false) }

    return { open, openDialog, closeDialog }
}