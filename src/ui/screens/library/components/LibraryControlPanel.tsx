import { Box, IconButton, Stack} from "@mui/material";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import { LibraryCheckboxControl } from "@/ui/screens/library/components/LibraryCheckboxControl";
import SortControl from "@/ui/features/problem/query/components/SortControl";
import type { LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { ProblemsQuery, useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery";

/////////////////////////////
export function LibraryControlPanel(props: {
    selection: LibrarySelection
    onDelete: (ids: ProblemId[]) => void
    onOpenEditDialog: (ids: ProblemId[]) => void
    onFilterControlOpen: () => void
    query: ProblemsQuery
}) {
    return (
        <Stack direction="row">
            { /* チェックボックス・選択操作 */}
            <LibraryCheckboxControl
                selection={props.selection}
                onDelete={props.onDelete}
                onOpenEditDialog={props.onOpenEditDialog}
            />

            <Box sx={{ flexGrow: 1 }} />

            { /* 検索フィルター */}
            <LibraryFilterIconButton onOpen={props.onFilterControlOpen} />

            {/* ソート */}
            <SortControl
                queryState={props.query.state}
                onSetSortKey={props.query.setSortKey}
                onToggleOrder={props.query.toggleSortOrder}
            />
        </Stack>
    )
}
export function LibraryFilterIconButton( { onOpen}: { onOpen: () => void}) {
    return (<IconButton onClick={onOpen} size="small">    
        <FilterListOutlinedIcon />
    </IconButton>)
}