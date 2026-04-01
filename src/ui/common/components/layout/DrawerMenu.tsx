import styles from "./AppLayout.module.css";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

export function DrawerMenu({ isOpen, onClose,
    onNavigateToMission, onNavigateToLibrary, onNavigateToStats, onNavigateToHistory,
     onImport, onBackupRestore }: {
        isOpen: boolean,
        onClose: () => void,
        onNavigateToMission: () => void
        onNavigateToLibrary: () => void
        onNavigateToStats: () => void
        onNavigateToHistory: () => void
        onBackupRestore: () => void
        onImport: () => void
    }) {
    return (
        <Drawer anchor="left" open={isOpen} onClose={onClose} >
            <Box width={250} mt={3} role="presentation" className={styles.header}>
                <List>
                    <ListItemButton onClick={() => onNavigateToMission()}>
                        <ListItemText primary="ミッション" />
                    </ListItemButton>
                    <ListItemButton onClick={() => onNavigateToLibrary()}>
                        <ListItemText primary="ライブラリ" />
                    </ListItemButton>
                    <ListItemButton onClick={() => onNavigateToStats()}>
                        <ListItemText primary="統計" />
                    </ListItemButton>
                    <ListItemButton onClick={() => onNavigateToHistory()}>
                        <ListItemText primary="履歴" />
                    </ListItemButton>                    

                    <Divider />

                    <ListItemButton onClick={() => { onImport(); onClose() }}>
                        <ListItemText primary="棋譜登録" />
                    </ListItemButton>
                    <ListItemButton onClick={() => { onBackupRestore(); onClose() }}>
                        <ListItemText primary="バックアップ・復旧" />
                    </ListItemButton>

                </List>
            </Box>
        </Drawer>
    )
}
