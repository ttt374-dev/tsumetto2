import { Box, IconButton, Tooltip, Button, Select, MenuItem } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { SortKey, SortOrder, SortState } from "@/domain/problem/service/query/sort";
import type { QueryState } from "@/domain/problem/service/query/ProblemsQuery";

export default function SortControl({ queryState, onSetSortKey, onToggleOrder }: {
    queryState: QueryState,
    onSetSortKey: (key: SortKey) => void,
    onToggleOrder: () => void
}) {
    const handleChangeKey = (e: any) => {
        onSetSortKey(e.target.value)
    }
    return (
        <Box>
            <Select value={queryState.sortKey} onChange={handleChangeKey} size="small">
                <MenuItem key="createdAt" value="createdAt">追加順</MenuItem>
                <MenuItem key="title" value="title">名前順</MenuItem>
                <MenuItem key="accuracy" value="accuracy">正答率</MenuItem>
                <MenuItem key="easeFactor" value="easeFactor">習熟度</MenuItem>
                <MenuItem key="nextReviewedAt" value="nextReviewedAt">次レビュー日</MenuItem>
                <MenuItem key="lastAnsweredAt" value="lastAnsweredAt">最終解答日</MenuItem>
                <MenuItem key="random" value="random">ランダム</MenuItem>
            </Select>

            <IconButton onClick={onToggleOrder}>
                {queryState.sortOrder === 'asc'
                    ? <ArrowUpwardIcon />
                    : <ArrowDownwardIcon />
                }
            </IconButton>
        </Box>
    )
}

