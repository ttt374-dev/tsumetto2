import { useState } from "react"
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Button, Drawer, IconButton, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import LibraryView from "./components/LibraryView";
import { AppShell } from "@/ui/common/components/layout/AppShell";
import { useLibraryViewModel } from "./hooks/useLibraryViewModel";
import { FilterControlPanel } from "@/ui/features/problem/query/FilterControlPanel";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { routes } from "@/ui/App/useAppNavigation";
import { SaveAsMissionDialog } from "@/ui/screens/library/dialogs/SaveAsMissionDialog";
import FooterNavigation from "@/ui/common/components/FooterNavigation";
import type { useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery";

//////////////////////////////////////////////////
export default function LibraryScreen() {
    const vm = useLibraryViewModel()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const startSession = useSessionStore(s => s.start)
    const navigate = useNavigate()    
    const deleteProblems = useProblemStore(s=>s.deleteProblems)

    const handleMissionStart = () => {
        startSession("library-instant-session", vm.ids)
        navigate(routes.sessionPlay)
    }

    return (
        <AppShell header="Library"
            rightActions={
                <>                    
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
                onDelete={deleteProblems}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
                onFilterControlOpen={() => setIsDrawerOpen(true)}
                onOpenEditDialog={vm.dialogs.tagEdit.openDialog}
            />
            {vm.dialogs.tagEdit.dialogElement}

            <LibraryQueryDrawer open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}
                query={vm.query}   
            />
        </AppShell>
    )
}

function LibraryQueryDrawer(props: {
    open: boolean,
    onClose: () => void
    query: ReturnType<typeof useProblemsQuery>
}) {
    const [isMissionSaveDialogOpen, setIsMissionSaveDialogOpen] = useState(false)
    const allSources = useProblemStore(s => s.allSources)
    const saveMission = useMissionStore(s => s.saveMission)

    const handleSaveAsMission = (title: string) => {
        //const queryState = vm.query.state
        saveMission({
            id: v4(),
            name: title ?? "untitled",
            queryState: props.query.state,
            order: 0,
            createdAt: Date.now(),
        })
    }
    return (<><Drawer anchor="bottom" open={props.open}
        onClose={props.onClose}
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
            query={props.query} allSources={allSources} />
        <Stack direction="row">
            <Button onClick={() => setIsMissionSaveDialogOpen(true)}>
                ミッションとして保存
            </Button>
            <Button onClick={props.onClose}>閉じる</Button>
        </Stack>
    </Drawer>

        <SaveAsMissionDialog
            open={isMissionSaveDialogOpen}
            onClose={() => setIsMissionSaveDialogOpen(false)}
            onSubmit={handleSaveAsMission}
        /></>)
}
////////////////////
