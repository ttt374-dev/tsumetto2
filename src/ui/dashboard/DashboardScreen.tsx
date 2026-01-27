import { Box, Button,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";
import { useImporter } from "@/application/useImporter";
import { Navigate, useNavigate } from "react-router-dom";
import { ListDialog } from "../mission/ListDialog";
import { useState } from "react";

/////////////////////////////////////////////

export function DashboardScreen() {
    const { query, missionSummary, problemIds, reloadStores } = useFilterProblems()
    const { start } = useMissionEventStoreContext()
    const toast = useToast()
    const navigate = useNavigate()
    const { openFileDialog, inputElement } = useImporter((files: File[]) => {
        reloadStores()
        toast({message: `imported ${files.length} file`})
    })    
    const [open, setOpen] = useState(false)
    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
            <Button onClick={()=> start(problemIds)} sx={{ height: 100 }}
                    variant="contained" fullWidth 
                    disabled={missionSummary.problemCount === 0}>
                    Start
                </Button>
            }
            fab={
                <Fab onClick={openFileDialog}>
                    <AddIcon />
                </Fab>
            }>
            <Button onClick={ () => setOpen(true)}>
                リスト
            </Button>
            <DashboardFilterControl filter={query.filterState}
                onToggleFilter={query.toggleFilter}
                onSetFilter={query.setFilter}/>

            <SummaryView summary={missionSummary}/>

            {inputElement}
            

            <ListDialog
                open={open}
                onClose={() => setOpen(false)}
                problemIds={problemIds}
            />

        </AppLayout>
    )
}