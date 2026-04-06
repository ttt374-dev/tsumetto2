import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Box, IconButton, List, Stack } from "@mui/material"
import { isEqual } from "lodash";

import SortControl from "../../common/query-control/SortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";
import type { LibraryActionMode } from "../hooks/useLibraryViewModel";
import type { useProblemsQuery } from "@/ui/common/hooks/useProblemsQuery";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

export type LibraryItemActions = {
    openTagEditDialog: (ids: ProblemId[]) => void
    deleteChecked: () => void
}

type LibraryViewProps = {
    ids: ProblemId[]
    //query: QueryController
    query: ReturnType<typeof useProblemsQuery>
    actionMode: LibraryActionMode
    changeActionMode: (mode: LibraryActionMode) => void
    //itemActions: LibraryItemActions,

    selection: {
        checkedIds: ProblemId[]
        isChecked: (id: ProblemId) => boolean

        selectAll: () => void
        clearAll: () => void
        toggleChecked: (id: ProblemId) => void
    }
    onItemClick: (p: Problem) => void
    onFilterControlOpen: () => void
    onOpenEditDialog: (ids: ProblemId[]) => void
    
}

/////////////////////////////////////////
export default function LibraryView({ ids, query, actionMode, changeActionMode,
    onItemClick, selection, onFilterControlOpen, onOpenEditDialog }: LibraryViewProps) {
    
    const isFiltered = !isEqual(query, DefaultQueryState);

    return (
        <>
            <Stack direction="row">
                { /* チェックボックス・選択操作 */ }
                <LibraryCheckboxControl
                    onCheckAll={selection.selectAll}
                    onUncheckAll={selection.clearAll}
                    actionMode={actionMode}
                    checkedIds={selection.checkedIds}
                    onChangeActionMode={changeActionMode}
                    //onOpenEditDialog={itemActions.openTagEditDialog}
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
                            showCheckbox={actionMode === "selection"}
                            onItemClick={onItemClick}
                            isChecked={selection.isChecked(id)}                            
                            onToggleChecked={selection.toggleChecked}
                            onChangeActionMode={changeActionMode}
                        />
                    ))}
                </List>
            </Box>

            
        </>
    )
}
