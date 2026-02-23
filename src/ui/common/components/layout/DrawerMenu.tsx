import styles from "./AppLayout.module.css";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

export function DrawerMenu({ isOpen, onClose,
    onNavigateToDashboard, onNavigateToLibrary, onImport, onBackupRestore }: {
        isOpen: boolean,
        onClose: () => void,
        onNavigateToDashboard: () => void
        onNavigateToLibrary: () => void
        onBackupRestore: () => void
        onImport: () => void
    }) {
    return (
        <Drawer anchor="left" open={isOpen} onClose={onClose} >
            <Box width={250} mt={3} role="presentation" className={styles.header}>
                <List>
                    <ListItemButton onClick={() => onNavigateToDashboard()}>
                        <ListItemText primary="デッキ" />
                    </ListItemButton>
                    <ListItemButton onClick={() => onNavigateToLibrary()}>
                        <ListItemText primary="ライブラリ" />
                    </ListItemButton>

                    <Divider />

                    <ListItemButton onClick={() => { onImport(); onClose() }}>
                        <ListItemText primary="インポート" />
                    </ListItemButton>
                    <ListItemButton onClick={() => { onBackupRestore(); onClose() }}>
                        <ListItemText primary="バックアップ・レストア" />
                    </ListItemButton>

                </List>
            </Box>
        </Drawer>
    )
}
