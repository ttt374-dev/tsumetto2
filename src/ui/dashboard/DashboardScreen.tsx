import { Box, Button,  } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useMissionPreview } from "../mission/hooks/useMissionPreview";
import type { ProblemId } from "@/domain/problem/Problem";
import { useEffect } from "react";
import { DashboardFilterControl } from "./DashboardFilterControl";
import { SummaryView } from "../summary/SummaryView";

/////////////////////////////////////////////

export function DashboardScreen({ onStart }: { 
    onStart: (ids: ProblemId[]) => void 
}) {
    const repos = useRepositoryContext()       
    const missionPreview = useMissionPreview()    
    const statsSummary = missionPreview.missionSummary
    //console.log("problemstats", problemStats)

    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")    
    const handleStart = () => {
        onStart(missionPreview.filteredProblems.map(p=>p.id))
    }
    useEffect(() => {
        setOnFilesSelected(async fileList => {
            const files = Array.from(fileList)
            const importer = createImportProblemsUsecase(repos.problem)
            await importer.importFiles(files)
            missionPreview.reload()
        })
    }, [repos.problem, missionPreview])
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
            <DashboardFilterControl filter={missionPreview.query.filterState}
                onToggleFilter={missionPreview.query.toggleFilter}
                onSetFilter={missionPreview.query.setFilter}/>

            <SummaryView summary={statsSummary}/>
            {inputElement}
        </AppLayout>
    )
}