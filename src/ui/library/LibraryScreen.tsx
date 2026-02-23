import BackupIcon from "@mui/icons-material/Backup";

import { IconButton } from "@mui/material";
import { AppShell } from "../common/components/layout/AppShell";
import { LibraryView } from "./components/LibraryView";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { useState } from "react";

//////////////////////////////////////////////////

export function LibraryScreen() {
    const vm = useLibraryViewModel()   

    return (
        <AppShell
            header="Library"
        >
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                actionMode={vm.mode}
                changeActionMode={vm.changeActionMode}
                itemActions={vm.itemActions}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
                        
            {vm.dialogs.detail.dialogElement}
            {vm.dialogs.tagEdit.dialogElement}
            {vm.dialogs.backupRestore.dialogElement}
        </AppShell>
    )
}