import { useState } from "react"

export function useDrawerState(){
    const [open, setOpen] = useState(false)

    return {
        open, 
        openDrawer: () => setOpen(true),
        closeDrawer: () => setOpen(false),
    }
}