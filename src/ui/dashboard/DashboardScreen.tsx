import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { DefaultFilterState, type FilterState } from "@/domain/Exercise/query/filter";
import type { Exercise } from "@/domain/Exercise/Exercise";

function DashboardFilterControl({ filter, onToggleFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
}) {

    return (
        <>
            <FormControl>
                <FormControlLabel control={
                    <Checkbox checked={filter.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スターのみ" />
                <FormControlLabel control={
                    <Checkbox checked={filter.isMissionTarget}
                        onChange={() => { onToggleFilter("isMissionTarget") }} />}
                    label="ミッションのみ" />
            </FormControl>
        </>
    )
}

export function DashboardScreen(
    {queuedExerciseList, filterState, onStart, onToggleFilter}: {
    queuedExerciseList: Exercise[],
    filterState: FilterState,
    onStart: () => void,
    onToggleFilter: (key: keyof FilterState) => void,
}
) {
    return (
        <AppLayout
            footer={
                <Button onClick={onStart}
                    variant="contained" fullWidth disabled={queuedExerciseList.length === 0}>
                    Start
                </Button>
            }
        >
            <DashboardFilterControl filter={filterState} onToggleFilter={onToggleFilter} />


            <Box>
                {queuedExerciseList.length}
            </Box>

        </AppLayout>
    )
}