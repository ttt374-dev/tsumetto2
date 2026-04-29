import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Box, IconButton, List, Stack } from "@mui/material"
import { isEqual } from "lodash";

import SortControl from "../../../features/problem/query/SortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";
import type { LibraryActionMode, LibrarySelection } from "../hooks/useLibraryViewModel";
import type { useProblemsQuery } from "@/ui/features/problem/hooks/useProblemsQuery";
import { DefaultQueryState } from "@/domain/problem/service/query/QueryState";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";

export type LibraryItemActions = {
    openTagEditDialog: (ids: ProblemId[]) => void
    deleteChecked: () => void
}

type LibraryViewProps = {
    ids: ProblemId[]
    query: ReturnType<typeof useProblemsQuery>
    //actionMode: LibraryActionMode
    //changeActionMode: (mode: LibraryActionMode) => void

    selection: LibrarySelection
    onItemClick: (p: Problem) => void
    onFilterControlOpen: () => void
    onDelete: (ids: ProblemId[]) => void
    onOpenEditDialog: (ids: ProblemId[]) => void
    
}

/////////////////////////////////////////
export default function LibraryView({ ids, query,onDelete,
    onItemClick, selection, onFilterControlOpen, onOpenEditDialog }: LibraryViewProps) {    
    const isFiltered = !isEqual(query, DefaultQueryState);
    
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
                <IconButton onClick={onFilterControlOpen} size="small">
                    { isFiltered ? <FilterListIcon color="primary"/> : 
                    
                    <FilterListOutlinedIcon/>}
                </IconButton>
                
                {/* ソート */}
                <SortControl
                    queryState={query.state}
                    onSetSortKey={query.setSortKey}
                    onToggleOrder={query.toggleSortOrder}
                />
            </Stack>

            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {ids.map(id => (
                        <LibraryListItem
                            key={id}
                            id={id}
                            onItemClick={onItemClick}
                            selection={selection}                                                
                            
                            
                            
                        />
                    ))}
                </List>
            </Box>            
        </>
    )
}
