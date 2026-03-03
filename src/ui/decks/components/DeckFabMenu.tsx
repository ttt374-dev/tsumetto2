import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function DeckFabMenu({onCreateNewDeck, onImportFiles}: {
    onCreateNewDeck: () => void
    onImportFiles: () => void
}) {
    return (
        <SpeedDial
            ariaLabel="add actions"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                icon={<FolderIcon />}
                onClick={onCreateNewDeck}
                slotProps={{
                    tooltip: {
                        title: "デッキを追加",
                        open: true,
                    },
                }}
            />
            <SpeedDialAction
                icon={<UploadFileIcon />}
                onClick={onImportFiles}
                slotProps={{
                    tooltip: {
                        title: "ファイルをインポート",
                        open: true,
                    },
                }}
            />
        </SpeedDial>
    );
}
