import { Box, IconButton, Tooltip, Button, Select, MenuItem, Stack } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { QueryState, SortKey } from "@/domain/problem/service/query/ProblemsQuery";

export function SortKeyControl(props: {
    queryState: QueryState,
    onSetSortKey: (key: SortKey) => void
}) {
    const handleChangeKey = (e: any) => {
        props.onSetSortKey(e.target.value)
    }
    return (
        <Select value={props.queryState.sortKey} onChange={handleChangeKey} size="small">
            <MenuItem key="createdAt" value="createdAt">追加順</MenuItem>
            <MenuItem key="title" value="title">名前順</MenuItem>
            <MenuItem key="accuracy" value="accuracy">正答率</MenuItem>
            <MenuItem key="easeFactor" value="easeFactor">習熟度</MenuItem>
            <MenuItem key="nextReviewedAt" value="nextReviewedAt">次レビュー日</MenuItem>
            <MenuItem key="lastAnsweredAt" value="lastAnsweredAt">最終解答日</MenuItem>
            <MenuItem key="random" value="random">ランダム</MenuItem>
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
