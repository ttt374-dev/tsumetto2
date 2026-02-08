import type { ProblemId } from "@/domain/problem/Problem";
import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

export function RightActionsDrawer({isOpen, onClose, onOpenDetailDialog, onOpenListDialog}: {
    isOpen: boolean
    onClose: () => void
    onOpenDetailDialog: () => void
    onOpenListDialog: () => void
}){
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} >
      <Box width={250} mt={3} role="presentation">
        <List>
          <ListItemButton onClick={() => {onOpenDetailDialog(); onClose()}}>
            <ListItemText primary="詳細・編集" />
          </ListItemButton>
          <ListItemButton onClick={() => {onOpenListDialog(); onClose(); }}>
            <ListItemText primary="ミッションリスト" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )    
}