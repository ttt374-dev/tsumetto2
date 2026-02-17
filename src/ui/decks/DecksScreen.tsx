import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import BackupIcon from "@mui/icons-material/Backup";
import { AppShell } from "../common/layout/AppShell";
import FabMenu from "./FabMenu";
import { useDecksViewModel } from "./hooks/useDecksViewModel";

export default function DecksScreen() {
    const {
        decks,
        deckStats,
        onCreateDeck,
        onStartMission,
        importer,
        backupRestoreDialog,
    } = useDecksViewModel();

    return (
        <AppShell
            header="Decks"
            /*
            rightActions={
                <IconButton onClick={backupRestoreDialog.openDialog}>
                    <BackupIcon sx={{ color: "#fff" }} />
                </IconButton>
            }*/
            fab={
                <FabMenu
                    onCreateNewDeck={() => onCreateDeck()}
                    onImportFiles={importer.openFileDialog}
                />
            }
        >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {decks.map(deck => {
                        const stats = deckStats.get(deck.id);
                        return (
                            <ListItem key={deck.id} disablePadding sx={{ borderBottom: 1, borderColor: "divider" }}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => window.location.href = `/deck/${deck.id}`}>
                                        <EditIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    onClick={() => onStartMission(deck)}
                                    disabled={stats?.problemCount === 0}
                                >
                                    <ListItemText
                                        primary={deck.name}
                                        secondary={`問題数：${stats?.problemCount}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            {/* ダイアログ */}
            {importer.pickerElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppShell>
    );
}
