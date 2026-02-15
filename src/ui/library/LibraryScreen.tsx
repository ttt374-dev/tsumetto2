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
            rightActions={
                <IconButton onClick={vm.presenter.dialogs.backupRestore.openDialog}>
                    <BackupIcon sx={{ color: "white" }} />
                </IconButton>
            }
        >
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                itemActions={vm.itemActions}
                selectActions={vm.handlers}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
            {vm.importer.pickerElement}
            {vm.importer.dialogElement}
            {vm.presenter.dialogs.viewer.dialogElement}
            {vm.presenter.dialogs.detail.dialogElement}
            {vm.presenter.dialogs.tagEdit.dialogElement}
            {vm.presenter.dialogs.backupRestore.dialogElement}
        </AppShell>
    )
}