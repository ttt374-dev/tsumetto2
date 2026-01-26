import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem, Paper } from "@mui/material";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";


export function DashboardFilterControl({ filter, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
}) {
    return (
        <Paper>
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
        </Paper>
    )
}