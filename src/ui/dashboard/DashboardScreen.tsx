import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useMissionPreview } from "../mission/hooks/useMissionPreview";
import type { ProblemId } from "@/domain/problem/Problem";

function DashboardFilterControl({ filter, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
}) {
    return (
        <FormControl sx={{ p: 2 }}>
            <FormControlLabel control={
                <Checkbox checked={filter.unansweredOnly}
                    onChange={() => { onToggleFilter("unansweredOnly") }} />}
                label="未回答のみ" />

            <FormControlLabel control={
                <Checkbox checked={filter.starredOnly}
                    onChange={() => { onToggleFilter("starredOnly") }} />}
                label="スターのみ" />
            <FormControlLabel control={
                <Checkbox checked={filter.isMissionTarget}
                    onChange={() => { onToggleFilter("isMissionTarget") }} />}
                label="ミッションのみ" />
            <MateLengthCheckboxes
                mateBuckets={filter.mateBuckets}
                onChange={(buckets) => {
                    //console.log("dsbd filter ", buckets)
                    onSetFilter({ mateBuckets: buckets })
                }}
            />
        </FormControl>
    )
}
/////////////////////////////////////////////
export function DashboardScreen({ onStart }: { 
    onStart: (ids: ProblemId[]) => void 
}) {
    const repos = useRepositoryContext()       
    const missionPreview = useMissionPreview()    
    const problemStats = {
        problemCount: missionPreview.problemCount,
        solvedCount: missionPreview.solvedCount,
        failedCount: missionPreview.failedCount,
    }
    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } =
        useFileSelector(".kif")
    setOnFilesSelected(async fileList => {
        const files = Array.from(fileList) 
        
        const importer = createImportProblemsUsecase(repos.problem)
        await importer.importFiles(files)
        //missionPreview.reload()
            
    })
    const handleStart = () => {
        onStart(missionPreview.filteredProblems.map(p=>p.id))
    }
    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
                <Button onClick={handleStart} sx={{ height: 100 }}
                    variant="contained" fullWidth disabled={problemStats.problemCount === 0}>
                    Start
                </Button>
            }
            fab={
                <Fab onClick={openFileDialog}>
                    <AddIcon />
                </Fab>
            }
        >
            <DashboardFilterControl filter={missionPreview.query.filterState}
                onToggleFilter={missionPreview.query.toggleFilter}
                onSetFilter={missionPreview.query.setFilter}
            />
            <Box>
                <Box>{problemStats.problemCount}</Box>
                {problemStats.solvedCount} : {problemStats.failedCount}
            </Box>

            {inputElement}
        </AppLayout>
    )
}