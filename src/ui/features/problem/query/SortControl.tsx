import { Box, IconButton, Tooltip, Button, Select, MenuItem, Stack } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { QueryState, SortKey } from "@/domain/problem/service/query/QueryState";

export const SortKeyLabel: Record<SortKey, string> = {
    "createdAt": "追加日",
    "title": "タイトル",
    "score": "スコア",
    "easeFactor": "習熟度",
    "nextReviewedAt": "次回レビュー日",
    "lastAnsweredAt": "前回解答日",
    "moveCount": "手数",
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
