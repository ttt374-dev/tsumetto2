import styles from "./AppLayout.module.css";
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";

export function DrawerMenu({ isOpen, onClose,
  onNavigateToDashboard, onNavigateToLibrary, onImport }: {
    isOpen: boolean,
    onClose: () => void,
    onNavigateToDashboard: () => void
    onNavigateToLibrary: () => void
    //onBackupRestore: () => void
    onImport: () => void
  }) {
  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose} >
      <Box width={250} mt={3} role="presentation" className={styles.header}>
        <List>
          <ListItemButton onClick={() => onNavigateToDashboard()}>
            <ListItemText primary="ダッシュボード" />
          </ListItemButton>
          <ListItemButton onClick={() => onNavigateToLibrary()}>
            <ListItemText primary="ライブラリ" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}
