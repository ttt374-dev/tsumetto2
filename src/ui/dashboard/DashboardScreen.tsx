import { Box, Button,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useDashboardFilterProblems } from "./hooks/useDashboardFilterProblems";
import { useEffect } from "react";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { useToast } from "../App/providers/ToastProvider";

/////////////////////////////////////////////

export function DashboardScreen() {
    const repos = useRepositoryContext()       
    const dashboard = useDashboardFilterProblems()    
    const { problemIds, } = dashboard
    const statsSummary = dashboard.missionSummary
    const missionStore = useMissionEventStoreContext()
    const toast = useToast()

    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")    
    const handleStart = () => {
        missionStore.start(problemIds)
    }
    useEffect(() => {
        setOnFilesSelected(async fileList => {
            const files = Array.from(fileList)
            //if (!window.confirm(`importing ${files.length} files`)) return
            const importer = createImportProblemsUsecase(repos.problem)
            await importer.importFiles(files)
            await dashboard.reloadStores()
            toast({message: `imported ${files.length} file`})
        })
    }, [repos.problem, dashboard])
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