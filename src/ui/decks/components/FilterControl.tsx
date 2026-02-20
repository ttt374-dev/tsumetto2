import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, List, ListItem, Paper } from "@mui/material";
import { type FilterState } from "@/domain/problem/query/filter";
import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";


export function FilterControl({ filter, allTags, onToggleFilter, onSetFilter }: {
    filter: FilterState, onToggleFilter: (key: keyof FilterState) => void
    onSetFilter: (partial: Partial<FilterState>) => void
    allTags: string[]
}) {
    return (
        <Paper sx={{
            m: 1,
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            <FormControl sx={{ p: 1 }}>
                <FormLabel component="legend">フィルター</FormLabel>
                <FormControlLabel control={
                    <Checkbox checked={filter.unansweredOnly}
                        onChange={() => { onToggleFilter("unansweredOnly") }} />}
                    label="未回答" />

                <FormControlLabel control={
                    <Checkbox checked={filter.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スター" />
                <FormControlLabel control={
                    <Checkbox checked={filter.dueForReviewOnly}
                        onChange={() => { onToggleFilter("dueForReviewOnly") }} />}
                    label="レビュー対象" />
            </FormControl>
        </Paper >


    )
}