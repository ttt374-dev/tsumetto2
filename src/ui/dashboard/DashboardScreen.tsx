import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { AppLayout } from "../common/AppLayout";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";
import { useFileSelector } from "../sharedComponents/useFileSelector";

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
export function DashboardScreen(
    { filterState, onStart, onToggleFilter, onSetFilter, onImportFiles, stats }: {
        filterState: FilterState,
        onStart: () => void,
        onToggleFilter: (key: keyof FilterState) => void,
        onSetFilter: (partial: Partial<FilterState>) => void,
        onImportFiles: (files: File[]) => void,
        stats: { problemCount: number, solvedCount: number, failedCount: number }

    }
) {
    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } =
        useFileSelector(".kif")
    setOnFilesSelected(async files => {
        onImportFiles(Array.from(files))
    })
    return (
        <AppLayout
            header={ "Dashboard"}
            footer={
                <Button onClick={onStart} sx={{ height: 100 }}
                    variant="contained" fullWidth disabled={stats.problemCount === 0}>
                    Start
                </Button>
            }
            fab={
                <Fab onClick={openFileDialog}>
                    <AddIcon />
                </Fab>
            }
        >
            <DashboardFilterControl filter={filterState}
                onToggleFilter={onToggleFilter}
                onSetFilter={onSetFilter}
            />
            <Box>
                <Box>{stats.problemCount}</Box>
                {stats.solvedCount} : {stats.failedCount}
            </Box>

            {inputElement}
        </AppLayout>
    )
}