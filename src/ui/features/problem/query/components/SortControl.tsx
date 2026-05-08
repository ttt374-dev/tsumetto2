import { Box, IconButton, Tooltip, Button, Select, MenuItem, Stack } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { QueryState, SortKey } from "@/domain/problem/service/query/QueryState";
import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";
import { learningStateLabels } from "@/ui/features/learning/hooks/learningPresenter";

export const SortKeyLabel: Record<SortKey, string> = {
    "createdAt": problemFieldLabels["createdAt"],
    "title": problemFieldLabels["title"],
    "score": learningStateLabels["score"],
    "easeFactor": learningStateLabels["easeFactor"],
    "nextReviewedAt": learningStateLabels["nextReviewedAt"],
    "lastAnsweredAt": learningStateLabels["lastAnsweredAt"],
    "moveCount": problemFieldLabels["plyLength"],
    "random": "ランダム",
}

export function SortKeyControl(props: {
    queryState: QueryState,
    onSetSortKey: (key: SortKey) => void
}) {
    const handleChangeKey = (e: any) => {
        props.onSetSortKey(e.target.value)
    }
    return (
        <Select value={props.queryState.sortKey} onChange={handleChangeKey} size="small">
            { Object.entries(SortKeyLabel).map(([k, v]) =>(
                <MenuItem key={k} value={k}>{v}</MenuItem>    
            ))}           
        </Select>
    )

}
export function SortOrderControl(props: {
    queryState: QueryState,
    onToggleOrder: () => void
}) {
    return (
        <IconButton onClick={props.onToggleOrder}>
            {props.queryState.sortOrder === 'asc'
                ? <ArrowUpwardIcon />
                : <ArrowDownwardIcon />
            }
        </IconButton>
    )
}

export default function SortControl({ queryState, onSetSortKey, onToggleOrder }: {
    queryState: QueryState,
    onSetSortKey: (key: SortKey) => void,
    onToggleOrder: () => void
}) {
    return (
        <Stack direction="row">
            <SortKeyControl queryState={queryState} onSetSortKey={onSetSortKey}/>
            <SortOrderControl queryState={queryState} onToggleOrder={onToggleOrder} />
        </Stack>
    )
}
