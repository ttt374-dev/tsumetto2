import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { SortKey, SortOrder, SortState } from "@/domain/problem/service/query/sort";

export default function LibrarySortControl({ sort, onSetSortKey, onToggleOrder }: {
    sort: SortState,
    onSetSortKey: (key: SortKey) => void,
    //onSetSortOrder: (order: SortOrder) => void,    
    onToggleOrder: () => void
}) {
    const handleChangeKey = (e: any) => {
        onSetSortKey(e.target.value)
    }
    return (
        <Box>
            <select value={sort.key} onChange={handleChangeKey}>
                <option key="createdAt" value="createdAt">追加順</option>
                <option key="title" value="title">名前順</option>
                <option key="accuracy" value="accuracy">正答率</option>
                <option key="easeFactor" value="easeFactor">習熟度</option>
                <option key="nextReviewedAt" value="nextReviewedAt">次レビュー日</option>
                <option key="random" value="random">ランダム</option>

            </select>

            <IconButton onClick={() => {                
                //onSetSortOrder(sort.order == "asc" ? "desc" : "asc")
                onToggleOrder()
                console.log("toggle sort order", sort.order)                
            }
            }>
                {sort.order === 'asc'
                    ? <ArrowUpwardIcon />
                    : <ArrowDownwardIcon />
                }
            </IconButton>
        </Box>
    )
}

