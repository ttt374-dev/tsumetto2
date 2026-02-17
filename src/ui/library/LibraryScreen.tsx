import BackupIcon from "@mui/icons-material/Backup";

import { IconButton } from "@mui/material";
import { AppShell } from "../common/layout/AppShell";
import { LibraryView } from "./components/LibraryView";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";

//////////////////////////////////////////////////

export function LibraryScreen() {
    const vm = useLibraryViewModel()   

    return (
        <AppShell
            header="Library"
            /*
            rightActions={
                <IconButton onClick={vm.dialogs.backupRestore.openDialog}>
                    <BackupIcon sx={{ color: "white" }} />
                </IconButton>
            }*/
        >
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                itemActions={vm.itemActions}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
            {vm.importer.pickerElement}
            {vm.importer.dialogElement}
            {vm.dialogs.viewer.dialogElement}
            {vm.dialogs.detail.dialogElement}
            {vm.dialogs.tagEdit.dialogElement}
            {vm.dialogs.backupRestore.dialogElement}
        </AppShell>
    )
}