import type { useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { FilterControlPanel } from "@/ui/features/problem/query/components/FilterControlPanel"
import { SaveAsMissionDialog } from "@/ui/screens/library/dialogs/SaveAsMissionDialog"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { Button, Drawer, Stack } from "@mui/material"
import { useState } from "react"
import { v4 } from "uuid"

export function LibraryQueryDrawer(props: {
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