import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { type FilterState } from "@/domain/Exercise/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { useExerciseControl } from "@/application/useExerciseControl";

function DashboardFilterControl({ filter, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
}) {

    return (
        <FormControl sx={{ p: 2 }}>
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
                            console.log("dsbd filter ", buckets)
                            onSetFilter({ mateBuckets: buckets})
                            //onToggleFilter()
                        }
                            //setFilter({ mateBuckets: buckets })
                        }
                    />

        </FormControl>

    )
}
/////////////////////////////////////////////
export function DashboardScreen(
    { filterState, onStart, onToggleFilter, onSetFilter, onImportFiles, stats }: {
        //queuedExerciseList: Exercise[],
        filterState: FilterState,
        onStart: () => void,
        onToggleFilter: (key: keyof FilterState) => void,
        onSetFilter: (partial: Partial<FilterState>) => void,
        onImportFiles: (files: File[]) => void,
        stats: { totalCount: number, solvedCount: number, failedCount: number }

    }
) {

    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } =
        useFileSelector(".kif")

    //const c = useLibraryController()
    const c = useExerciseControl()
    setOnFilesSelected(async files => {
        onImportFiles(Array.from(files))
        //await c.importFiles(Array.from(files))
        //navigate("/library")
    })
    return (
        <AppLayout
            footer={
                <Button onClick={onStart}
                    variant="contained" fullWidth disabled={stats.totalCount === 0}>
                    Start
                </Button>
            }
        >
            <DashboardFilterControl filter={filterState} 
                onToggleFilter={onToggleFilter}
                onSetFilter={onSetFilter}
                 />
            <Box>
                <Box>{stats.totalCount}</Box>
                {stats.solvedCount} : {stats.failedCount}
            </Box>

            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 60,
                    right: 16,
                }}
            >
                <AddIcon onClick={openFileDialog}/>
            </Fab>
                   {inputElement}
        </AppLayout>
    )
}