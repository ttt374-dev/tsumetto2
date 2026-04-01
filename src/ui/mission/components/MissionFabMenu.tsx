import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'

export default function MissionFabMenu({ onCreateNewMission }: {
    onCreateNewMission: () => void
    //onImportFiles: () => void
}) {
    return (
        <Fab onClick={onCreateNewMission} color="primary">
            <AddIcon />
        </Fab>
    );
}
