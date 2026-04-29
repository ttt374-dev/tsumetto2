import { useState } from "react"

export function useDialog(){
    const [open, setOpen] = useState(false)

    const openDialog = () => { setOpen(true) }
    const closeDialog = () => { setOpen(false) }

    return { open, openDialog, closeDialog }
}