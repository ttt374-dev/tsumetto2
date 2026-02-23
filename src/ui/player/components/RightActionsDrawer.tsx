import type { ProblemId } from "@/domain/problem/entity/Problem";
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";

export function useRightActionsDrawer(
    onOpenDetailDialog: () => void,
) {
    const [open, setOpen] = useState(false)

    const openDialog = () => setOpen(true)
    const closeDialog =() => setOpen(false)

    const drawerElement = (
        <RightActionsDrawer
            isOpen={open}
            onClose={closeDialog}
            onOpenDetailDialog={onOpenDetailDialog}
         />
    )
    return { openDialog, drawerElement}
}
export function RightActionsDrawer({ isOpen, onClose, onOpenDetailDialog }: {
    isOpen: boolean
    onClose: () => void
    onOpenDetailDialog: () => void
}) {
    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose} >
            <Box width={250} mt={3} role="presentation">
                <List>
                    <ListItemButton onClick={() => { onOpenDetailDialog(); onClose() }}>
                        <ListItemText primary="詳細・編集" />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    )
}