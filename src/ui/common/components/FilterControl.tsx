import { Box, Button, Checkbox, FormControl, FormControlLabel, List, ListItem, Paper } from "@mui/material";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthCheckboxes } from "./MateLengthCheckbox";
import { useQuery } from "@/application/useQuery";
import { TagCheckboxFilterControl } from "../../dashboard/components/TagCheckboxFilterControl";


export function FilterControl({ filter, allTags, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
    allTags: string[]
}) {
    return (
        
        <FormControl sx={{ p: 1 }}>
            <Paper sx={{m: 1}}>
                <FormControlLabel control={
                    <Checkbox checked={filter.unansweredOnly}
                        onChange={() => { onToggleFilter("unansweredOnly") }} />}
                    label="未回答のみ" />

                <FormControlLabel control={
                    <Checkbox checked={filter.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スターのみ" />
                <FormControlLabel control={
                    <Checkbox checked={filter.dueForReviewOnly}
                        onChange={() => { onToggleFilter("dueForReviewOnly") }} />}
                    label="レビュー対象のみ" />
            </Paper>
            <MateLengthCheckboxes
                mateBuckets={filter.mateBuckets}
                onChange={(buckets) => {
                    onSetFilter({ mateBuckets: buckets })
                }}
            />

            <TagCheckboxFilterControl
                allTags={allTags} selectedTags={filter.tags ?? []}
                onChange={(tags => { onSetFilter({ tags: tags }) })}
            />
        </FormControl>

    )
}