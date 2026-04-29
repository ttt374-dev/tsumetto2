import { useState } from "react"
import { Box, IconButton, Stack} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { LibraryQueryDrawer } from "@/ui/screens/library/components/LibraryQueryDrawer";
import { LibraryListView } from "@/ui/screens/library/components/LibraryListView";
import { LibraryControlPanel } from "@/ui/screens/library/components/LibraryControlPanel";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const vm = useLibraryViewModel()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const deleteProblems = useProblemStore(s=>s.deleteProblems)

    return (
        <AppShell header="Library"
            rightActions={
                <>                    
                    <IconButton onClick={vm.startMission} sx={{ color: "white" }}>
                        <PlayArrowIcon />
                    </IconButton>                    
                </>
            }
            footer={<FooterNavigation/>}
        >
            <LibraryControlPanel
                selection={vm.selection}
                onDelete={deleteProblems}
                onFilterControlOpen={() => setIsDrawerOpen(true)}
                onOpenEditDialog={vm.dialogs.edit.openDialog}
                query={vm.query}
            />
            <LibraryListView
                ids={vm.ids}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
            {vm.dialogs.edit.dialogElement}

            <LibraryQueryDrawer open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}
                query={vm.query}   
            />
        </AppShell>
    )
}
