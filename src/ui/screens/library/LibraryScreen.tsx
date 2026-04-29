import { useState } from "react"
import { IconButton} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import LibraryView from "./components/LibraryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import { LibraryQueryDrawer } from "@/ui/screens/library/components/LibraryQueryDrawer";

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
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                onDelete={deleteProblems}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
                onFilterControlOpen={() => setIsDrawerOpen(true)}
                onOpenEditDialog={vm.dialogs.edit.openDialog}
            />
            {vm.dialogs.edit.dialogElement}

            <LibraryQueryDrawer open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}
                query={vm.query}   
            />
        </AppShell>
    )
}


