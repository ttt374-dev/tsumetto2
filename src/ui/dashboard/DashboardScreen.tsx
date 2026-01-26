import { Box, Button,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useDashboard } from "./hooks/useDashboard";
import type { ProblemId } from "@/domain/problem/Problem";
import { useEffect } from "react";
import { DashboardFilterControl } from "./components/DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";

/////////////////////////////////////////////

export function DashboardScreen() {
    const repos = useRepositoryContext()       
    const dashboard = useDashboard()    
    const statsSummary = dashboard.missionSummary
    //console.log("problemstats", problemStats)
    const missionStore = useMissionEventStoreContext()

    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")    
    const handleStart = () => {
        //onStart(missionPreview.filteredProblems.map(p=>p.id))

        missionStore.start(dashboard.problemIds)
    }
    useEffect(() => {
        setOnFilesSelected(async fileList => {
            const files = Array.from(fileList)
            const importer = createImportProblemsUsecase(repos.problem)
            await importer.importFiles(files)
            dashboard.reload()
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