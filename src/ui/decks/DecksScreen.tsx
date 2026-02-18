import { Box, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { AppShell } from "../common/layout/AppShell";
import FabMenu from "./FabMenu";
import { useDecksViewModel } from "./hooks/useDecksViewModel";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";

export default function DecksScreen() {
    const {
        decks,
        deckStats,
        onCreateDeck,
        onStartMission,
        importer,
        backupRestoreDialog,
    } = useDecksViewModel();

    const navigate = useNavigate()
    return (
        <AppShell
            header="Decks"
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
                                    <IconButton edge="end" onClick={() => navigate(routes.deckEdit(deck.id))}>
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
