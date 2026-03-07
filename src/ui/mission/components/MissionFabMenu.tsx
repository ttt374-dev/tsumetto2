import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'

export default function MissionFabMenu({ onCreateNewMission }: {
    onCreateNewMission: () => void
    //onImportFiles: () => void
}) {
    return (
        <Fab onClick={onCreateNewMission}
            color="primary"
            sx={{ position: "fixed", bottom: 16, right: 16 }}>
            <AddIcon />
        </Fab>

    );
}
