import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Button, IconButton,  } from "@mui/material";

import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";
import { ListDialog } from "../mission/ListDialog";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useImportController } from "@/application/useImportControler";

/////////////////////////////////////////////

export function DashboardScreen() {
    const { query, missionSummary, problemIds } = useFilterProblems()
    const { start } = useMissionEventStoreContext()
    const toast = useToast()
    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    
    const importController = useImportController(async (files: File[]) => {
        await store.reload()
        toast({message: `imported ${files.length} file`})
    })
    const [openListDialog, setOpenListDialog] = useState(false)

    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
            <Button onClick={()=> start(problemIds)}
                    sx={{height: 64}}
                    variant="contained" fullWidth 
                    disabled={missionSummary.problemCount === 0}>
                    Start
                </Button>
            }
            rightActions={
                <>
                    <Button onClick={() => setOpenListDialog(true)} sx={{color: "white"}}>
                        リスト
                    </Button>
                    <IconButton onClick={importController.openFileDialog}>
                        <AddOutlinedIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </>
            }>
            
            <DashboardFilterControl 
                filter={query.filterState}
                allTags={store.allTags}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}/>
            <SummaryView summary={missionSummary}/>

            {importController.pickerElement} { importController.dialogElement}
            
            <ListDialog
                open={openListDialog}
                onClose={() => setOpenListDialog(false)}
                problemIds={problemIds}
                onSelectProblem={()=>{}}
            />

        </AppLayout>
    )
}