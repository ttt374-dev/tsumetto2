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
import { FilterControl } from "@/ui/common/query-control/FilterControl";
import { DefaultFilterState, type FilterState } from "@/domain/problem/service/query/filter";
import { MateLengthFilterControl } from "@/ui/common/query-control/MateLengthFilterControl";
import { TagCheckboxFilterControl } from "@/ui/common/query-control/TagCheckboxFilterControl";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { isEqual } from "lodash";
import { FilterControlPanel } from "@/ui/common/query-control/FilterControlPanel";

export type LibraryItemActions = {
    openTagEditDialog: (ids: ProblemId[]) => void
    deleteChecked: () => void
}

type LibraryViewProps = {
    ids: ProblemId[]
    query: QueryController
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
    const allTags = useProblemStore(s=>s.allTags)
    useEffect(()=>{ query.filter.addFilter({text: filterText})}, [filterText])
    
    const handleToggleShowFilterText = () => { 
        if (showFilterText) setFilterText("")
        setShowFilterText(prev => !prev)         
    }
    const handleToggleFilter = (key: keyof FilterState) => {
        query.filter.toggleFilter(key)
    }
    const isFiltered = !isEqual(query.filter.state, DefaultFilterState);
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
                    sort={query.sort.state}
                    onSetSortKey={query.sort.setKey}
                    onToggleOrder={query.sort.toggleOrder}
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
                    <FilterControlPanel filter={query.filter.state} addFilter={query.filter.addFilter} toggleFilter={query.filter.toggleFilter}/>
                </div>

            </Drawer>
        </>
    )
}
