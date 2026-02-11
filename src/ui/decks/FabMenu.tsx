import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function FabMenu({onCreateNewDeck, onImportFiles}: {
    onCreateNewDeck: () => void
    onImportFiles: () => void
}) {
  const handleAddDeck = () => {
    console.log("デッキ追加");
  };

  const handleImportFile = () => {
    console.log("ファイルインポート");
  };

  return (
    <SpeedDial
      ariaLabel="add actions"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        icon={<FolderIcon />}
        tooltipTitle="デッキを追加"
        onClick={onCreateNewDeck}
      />
      <SpeedDialAction
        icon={<UploadFileIcon />}
        tooltipTitle="ファイルをインポート"
        onClick={onImportFiles}
      />
    </SpeedDial>
  );
}
