import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Box, IconButton, List, Stack } from "@mui/material"
import { isEqual } from "lodash";

import SortControl from "../../../features/problem/query/SortControl"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";
import type { useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery";
import type { LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection";
import { ListView } from "@/ui/dialogs/list/ListView";

type LibraryViewProps = {
    ids: ProblemId[]
    query: ReturnType<typeof useProblemsQuery>

    selection: LibrarySelection
    onItemClick: (pid: ProblemId) => void
    onFilterControlOpen: () => void
    onDelete: (ids: ProblemId[]) => void
    onOpenEditDialog: (ids: ProblemId[]) => void    
}

/////////////////////////////////////////
export default function LibraryView({ ids, query,onDelete,
    onItemClick, selection, onFilterControlOpen, onOpenEditDialog }: LibraryViewProps) {    
    //const isFiltered = !isEqual(query, DefaultQueryState);
    
    return (
        <>
            <Stack direction="row">
                { /* チェックボックス・選択操作 */ }
                <LibraryCheckboxControl
                    selection={selection}
                    onDelete={onDelete}                    
                    onOpenEditDialog={onOpenEditDialog}
                />

                <Box sx={{ flexGrow: 1 }} />

                { /* 検索フィルター */}
                <LibraryFilterIconButton onOpen={onFilterControlOpen}/>               
                
                {/* ソート */}
                <SortControl
                    queryState={query.state}
                    onSetSortKey={query.setSortKey}
                    onToggleOrder={query.toggleSortOrder}
                />
            </Stack>
            <ListView ids={ids} selection={selection} onItemClick={onItemClick}/>       
        </>
    )
}

function LibraryFilterIconButton( { onOpen}: { onOpen: () => void}) {
    return (<IconButton onClick={onOpen} size="small">    
        <FilterListOutlinedIcon />
    </IconButton>)
}