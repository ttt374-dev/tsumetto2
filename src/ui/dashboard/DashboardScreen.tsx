import { Box, Button,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useFilterProblems } from "./hooks/useFilterProblems";
import { useEffect } from "react";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";
import { useImporter } from "@/application/useImporter";

/////////////////////////////////////////////

export function DashboardScreen() {
    //const repos = useRepositoryContext()       
    const dashboard = useFilterProblems()    

    const statsSummary = dashboard.missionSummary
    const missionStore = useMissionEventStoreContext()
    const toast = useToast()

    // インポート用
    //const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")    
    
    const { openFileDialog, inputElement } = useImporter((files: File[]) => {
        dashboard.reloadStores()
        toast({message: `imported ${files.length} file`})
    })    

    const handleStart = () => {
        missionStore.start(dashboard.problemIds)
    }
    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
                <Button onClick={handleStart} sx={{ height: 100 }}
                    variant="contained" fullWidth disabled={statsSummary.problemCount === 0}>
                    Start
                </Button>
            }
            fab={
                <Fab onClick={openFileDialog}>
                    <AddIcon />
                </Fab>
            }>
            <DashboardFilterControl filter={dashboard.query.filterState}
                onToggleFilter={dashboard.query.toggleFilter}
                onSetFilter={dashboard.query.setFilter}/>

            <SummaryView summary={statsSummary}/>
            {inputElement}
        </AppLayout>
    )
}