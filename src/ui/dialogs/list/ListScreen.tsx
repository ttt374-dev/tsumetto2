import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { routes } from "@/ui/App/useAppNavigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import type { ProblemId } from "@/domain/problem/entity/Problem";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { LibraryListView } from "../../screens/library/components/LibraryListView";
import { useLibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection";
import { LibraryCheckboxControl } from "@/ui/screens/library/components/LibraryCheckboxControl";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useMultipleProblemsEditDialog } from "@/ui/dialogs/MultipleProblemsEditorDialog";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";

type ViewerLocationState = {
    title: string
    ids: string[]
}

export function ListScreen() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"
    
    const byId = useProblemStore(s=>s.byId)
    const visibleIds = useMemo(() => {
        return ids.filter(id => byId[id] != null && !byId[id].deletedAt)
    }, [ids, byId])
    const selection = useLibrarySelection(visibleIds)
    
    const handleItemClick = (id: ProblemId) => {
        if (selection.isSelecting)  
            selection.toggleChecked(id)
        else
            navigate(routes.detail(id))
    }
    const startSession = useSessionStore(s => s.start)
    const handleStartSession = () => {
        startSession("library-instant-session", ids)
        navigate(routes.sessionPlay)    
    }
    const deleteProblems = useProblemStore(s=>s.deleteProblems)    
    const editDialog = useMultipleProblemsEditDialog()    
    
    return (
        <AppShell header={title}
        rightActions={
                <IconButton onClick={handleStartSession} sx={{ color: "white" }}>
                    <PlayArrowIcon />
                </IconButton>
            }
            footer={<Button variant="outlined" onClick={() => navigate(routes.back)}>戻る</Button>}>
            <LibraryCheckboxControl
                selection={selection}
                onDelete={deleteProblems}
                onOpenEditDialog={editDialog.openDialog}
            />
            <LibraryListView ids={visibleIds} onItemClick={handleItemClick} selection={selection} />
            { editDialog.dialogElement}
        </AppShell>
    )
}

