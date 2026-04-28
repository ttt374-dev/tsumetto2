import { useState } from "react"

import { Button, Drawer, IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save"

import LibraryView from "./components/LibraryView";
import { AppShell } from "../../common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { FilterControlPanel } from "@/ui/features/problem/query/FilterControlPanel";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";
import { v4 } from "uuid";
import { WindowSharp } from "@mui/icons-material";
import { SaveAsMissionDialog } from "@/ui/screens/library/dialogs/SaveAsMissionDialog";
import FooterNavigation from "@/ui/common/components/FooterNavigation";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const [isMissionSaveDialogOpen, setIsMissionSaveDialogOpen] = useState(false)

    const vm = useLibraryViewModel()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const allSources = useProblemStore(s => s.allSources)
    const startSession = useSessionStore(s => s.start)
    const navigate = useNavigate()
    const saveMission = useMissionStore(s => s.saveMission)

    const handleSaveAsMission = (title: string) => {
        const queryState = vm.query.state
        saveMission({
            id: v4(),
            name: title ?? "untitled",
            queryState,
            order: 0,
            createdAt: Date.now(),
        })

        //window.confirm("saved as 'untitlted' mission")
    }
    const handleMissionStart = () => {
        startSession("library-instant-session", vm.ids)
        navigate(routes.sessionPlay)
    }

    return (
        <AppShell header="Library"
            rightActions={
                <>
                    <IconButton onClick={() => setIsMissionSaveDialogOpen(true)} sx={{ color: "white" }}>
                        <SaveIcon />
                    </IconButton>

                    <IconButton onClick={handleMissionStart} sx={{ color: "white" }}>
                        <PlayArrowIcon />
                    </IconButton>
                </>
            }
            footer={<FooterNavigation/>}
        >
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                actionMode={vm.mode}
                changeActionMode={vm.changeActionMode}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
                onFilterControlOpen={() => setIsDrawerOpen(true)}
                onOpenEditDialog={vm.dialogs.tagEdit.openDialog}
            />
            {vm.dialogs.tagEdit.dialogElement}

            <Drawer anchor="bottom" open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
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
                <Button onClick={() => setIsDrawerOpen(false)}>閉じる</Button>
            </Drawer>

            <SaveAsMissionDialog
                open={isMissionSaveDialogOpen}
                onClose={() => setIsMissionSaveDialogOpen(false)}
                onSubmit={handleSaveAsMission}
            />
        </AppShell>
    )
}


////////////////////
