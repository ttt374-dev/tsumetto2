import { useState } from "react"
import { Box, IconButton, Stack} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { LibraryQueryDrawer } from "@/ui/screens/library/components/LibraryQueryDrawer";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";
import { LibraryControlPanel } from "@/ui/screens/library/components/LibraryControlPanel";
import { MultipleProblemsEditorDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const vm = useLibraryViewModel()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <AppShell header="Library"
            rightActions={
                <IconButton onClick={vm.session.start} sx={{ color: "white" }}>
                    <PlayArrowIcon />
                </IconButton>
            }
            footer={<FooterNavigation />}
        >
            <LibraryControlPanel
                selection={vm.selection}
                onDelete={vm.commands.delete}
                onFilterControlOpen={() => setIsDrawerOpen(true)}
                onOpenEditDialog={vm.dialogs.edit.openDialog}
                query={vm.query}
            />
            <LibraryListView
                ids={vm.ids}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
            <MultipleProblemsEditorDialog 
                open={vm.dialogs.edit.open}
                onClose={vm.dialogs.edit.closeDialog}
                checkedIds={vm.dialogs.edit.checkedIds}
            />

            <LibraryQueryDrawer open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}
                query={vm.query}   
            />
        </AppShell>
    )
}
