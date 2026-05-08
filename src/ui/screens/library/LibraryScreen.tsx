import { Box, IconButton, Stack} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { LibraryQueryDrawer } from "@/ui/screens/library/components/LibraryQueryDrawer";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";
import { LibraryControlPanel } from "@/ui/screens/library/components/LibraryControlPanel";
import { MultipleProblemsEditorDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog";
import { useLibraryInteractions } from "@/ui/screens/library/hooks/useLibraryInteractions";
import { useLibraryPresentation } from "@/ui/screens/library/hooks/useLibraryPresentation";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const model = useLibraryPresentation()
    const interactions = useLibraryInteractions(model.state.selection)    

    return (
        <AppShell header="Library"
            rightActions={
                <IconButton onClick={model.actions.session.start} sx={{ color: "white" }}>
                    <PlayArrowIcon />
                </IconButton>
            }
            footer={<FooterNavigation />}
        >
            <LibraryControlPanel
                selection={model.state.selection}
                onDelete={model.actions.problem.delete}
                onFilterControlOpen={model.ui.drawer.open}
                onOpenEditDialog={model.ui.dialogs.edit.openDialog}
                query={model.state.query}
            />
            <LibraryListView
                ids={model.state.ids}
                onItemClick={interactions.onItemClick}
                selection={model.state.selection}
            />
            <MultipleProblemsEditorDialog 
                open={model.ui.dialogs.edit.open}
                onClose={model.ui.dialogs.edit.closeDialog}
                checkedIds={model.ui.dialogs.edit.checkedIds}
            />

            <LibraryQueryDrawer open={model.ui.drawer.isOpen} onClose={model.ui.drawer.close}
                query={model.state.query}   
            />
        </AppShell>
    )
}
