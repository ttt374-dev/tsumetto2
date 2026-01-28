import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem, Paper } from "@mui/material";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";
import { useQuery } from "@/application/useQuery";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";


export function DashboardFilterControl({ filter, allTags, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
    allTags: string[]
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

                <TagCheckboxFilterControl
                    allTags={allTags} selectedTags={filter.tags ?? []} 
                    onChange={(tags => { onSetFilter({tags: tags})})}
                />
            </FormControl>
        </Paper>
    )
}