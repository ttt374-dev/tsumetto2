import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'

export default function DeckFabMenu({ onCreateNewDeck }: {
    onCreateNewDeck: () => void
    //onImportFiles: () => void
}) {
    return (
        <Fab onClick={onCreateNewDeck}
            color="primary"
            sx={{ position: "fixed", bottom: 16, right: 16 }}>
            <AddIcon />
        </Fab>

    );
}
