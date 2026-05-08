import { useState } from "react"

import { useMultipleProblemsEditDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog";
import { useLibraryActions } from "@/ui/screens/library/hooks/useLibraryActions";
import { useLibraryViewModel } from "@/ui/screens/library/hooks/useLibraryViewModel";

export function useLibraryPresentation(){
    const vm = useLibraryViewModel()

    return {
        state: vm,
        actions: useLibraryActions(vm.ids),
        ui: {
            dialogs: useLibraryDialogs(),
            drawer: useLibraryDrawer(),
        }
    }
}
//////////
function useLibraryDialogs(){
    return {
        edit: useMultipleProblemsEditDialog()
    }
}
function useLibraryDrawer() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return {
        isOpen: isDrawerOpen,
        open: () => setIsDrawerOpen(true),
        close: () => setIsDrawerOpen(false),
    }
}
