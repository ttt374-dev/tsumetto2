import { Checkbox, FormControl, FormControlLabel, FormLabel, List, ListItem, Paper } from "@mui/material";
import type { BooleanQueryKey, QueryState } from "@/domain/problem/service/query/ProblemsQuery";


export function BooleanFilterControl({ queryState, onToggleFilter}: {
    //filter: FilterState, 
    queryState: QueryState
    onToggleFilter: (key: BooleanQueryKey) => void        
}) {
    return (
        <FormControl fullWidth>
            <FormLabel>フィルター</FormLabel>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
                <FormControlLabel control={
                    <Checkbox checked={queryState.unansweredOnly}
                        onChange={() => { onToggleFilter("unansweredOnly") }} />}
                    label="未回答" />

                <FormControlLabel control={
                    <Checkbox checked={queryState.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スター" />
                <FormControlLabel control={
                    <Checkbox checked={queryState.dueForReviewOnly}
                        onChange={() => { onToggleFilter("dueForReviewOnly") }} />}
                    label="レビュー対象" />
            </Paper>
        </FormControl>
    )
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
                    <Checkbox checked={queryState.unansweredOnly}
                        onChange={() => { onToggleFilter("unansweredOnly") }} />}
                    label="未回答" />
  
                <FormControlLabel control={
                    <Checkbox checked={queryState.starredOnly}
                        onChange={() => { onToggleFilter("starredOnly") }} />}
                    label="スター" />
                <FormControlLabel control={
                    <Checkbox checked={queryState.dueForReviewOnly}
                        onChange={() => { onToggleFilter("dueForReviewOnly") }} />}
                    label="レビュー対象" />
            </FormControl>
        </Paper >


    )
}