import { AppShell } from "../common/components/layout/AppShell";
import { LibraryView } from "./components/LibraryView";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";

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
            {vm.dialogs.tagEdit.dialogElement}            
        </AppShell>
    )
}