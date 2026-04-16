import { useState } from "react";
import { Drawer } from "@mui/material";

import LibraryView from "./components/LibraryView";
import { AppShell } from "../../common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { FilterControlPanel } from "@/ui/features/problem/query/FilterControlPanel";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const vm = useLibraryViewModel()   
    const [isOpen, setIsOpen] = useState(false);
    const allSources = useProblemStore(s=>s.allSources)
    
    return (
        <AppShell header="Library">
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                actionMode={vm.mode}
                changeActionMode={vm.changeActionMode}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
                onFilterControlOpen={()=>setIsOpen(true)}
                onOpenEditDialog={vm.dialogs.tagEdit.openDialog}                
            />                                    
            {vm.dialogs.tagEdit.dialogElement}    

            <Drawer anchor="bottom" open={isOpen} 
                onClose={() => setIsOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            pb: "calc(env(safe-area-inset-bottom) + 16px)",
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                        },
                    },
                }}>                
                <FilterControlPanel
                    query={vm.query} allSources={allSources} />
            </Drawer>        
        </AppShell>
    )
}