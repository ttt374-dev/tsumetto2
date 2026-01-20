import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem } from "@mui/material";
import { AppLayout } from "../common/AppLayout";
import { DefaultFilterState, type FilterState } from "@/domain/Exercise/query/filter";
import type { Exercise } from "@/domain/Exercise/Exercise";
import type { MissionSummary } from "@/domain/mission/MissionSummary";

function DashboardFilterControl({ filter, onToggleFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
}) {

    return (
        <>
            <FormControl sx={{p: 2}}>
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
/////////////////////////////////////////////
export function DashboardScreen(
    {filterState, onStart, onToggleFilter, stats}: {
    //queuedExerciseList: Exercise[],
    filterState: FilterState,
    onStart: () => void,
    onToggleFilter: (key: keyof FilterState) => void,
    stats: { totalCount: number, solvedCount: number, failedCount: number }
    
}
) {
    return (
        <AppLayout
            footer={
                <Button onClick={onStart}
                    variant="contained" fullWidth disabled={stats.totalCount === 0}>
                    Start
                </Button>
            }
        >
            <DashboardFilterControl filter={filterState} onToggleFilter={onToggleFilter} />
            <Box>
                <Box>{stats.totalCount}</Box>
                {stats.solvedCount} / {stats.failedCount}
            </Box>

        </AppLayout>
    )
}