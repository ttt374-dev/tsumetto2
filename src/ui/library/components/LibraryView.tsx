import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Box, Button, Drawer, IconButton, List, Stack, TextField, ToggleButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from '@mui/icons-material/Edit';
import SelectAllIcon from "@mui/icons-material/SelectAll";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from "@mui/icons-material/Search";

import SortControl from "../../common/query-control/SortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";
import type { LibraryActionMode } from "../hooks/useLibraryViewModel";
import { useEffect, useState } from "react";
import type { QueryController } from "@/ui/common/hooks/useQuery";
import { BooleanFilterControl } from "@/ui/common/query-control/BooleanFilterControl";
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter";
import { MateLengthFilterControl } from "@/ui/common/query-control/MateLengthFilterControl";
import { TagCheckboxFilterControl } from "@/ui/common/query-control/TagCheckboxFilterControl";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { isEqual } from "lodash";
import { FilterControlPanel } from "@/ui/common/query-control/FilterControlPanel";
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
    itemActions: LibraryItemActions,

    selection: {
        checkedIds: ProblemId[]
        isChecked: (id: ProblemId) => boolean

        selectAll: () => void
        clearAll: () => void
        toggleChecked: (id: ProblemId) => void
    }
    onItemClick: (p: Problem) => void
}

/////////////////////////////////////////
export function LibraryView({ ids, query, actionMode, changeActionMode,
    itemActions, onItemClick, selection }: LibraryViewProps) {

    const [showFilterText, setShowFilterText] = useState(false)
    const [ filterText, setFilterText] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        uncleared: false,
        cleared: false,
        hard: false,
        favorite: false,
    });

    const allSources = useProblemStore(s=>s.allSources)

    const isFiltered = !isEqual(query, DefaultQueryState);
    //console.log("is filtered", isFiltered, query.filter.state, DefaultFilterState)
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
                    itemActions={itemActions}
                />

                <Box sx={{ flexGrow: 1 }} />

                { /* 検索フィルター */}
                <IconButton onClick={() => setIsOpen(true)} size="small">
                    { isFiltered ? <FilterListIcon color="primary"/> : 
                    
                    <FilterListOutlinedIcon/>}
                </IconButton>
                { /* 
                {showFilterText &&
                    <TextField value={filterText} size="small"
                        onChange={(e) => setFilterText(e.target.value)} />
                }
                <IconButton onClick={handleToggleShowFilterText}>
                    <SearchIcon />
                </IconButton>*/ }
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
                        />
                    ))}
                </List>
            </Box>

            <Drawer anchor="bottom" open={isOpen} 
                onClose={() => setIsOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            pb: "calc(env(safe-area-inset-bottom) + 16px)",
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                        },
                    },
                }}>
                <div className="bottom-sheet">
                    <FilterControlPanel 
                        query={query} allSources={allSources}/>
                </div>

            </Drawer>
        </>
    )
}
