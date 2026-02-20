
import { Box, Button, IconButton, List, Stack, ToggleButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import EditIcon from '@mui/icons-material/Edit';
import SelectAllIcon from "@mui/icons-material/SelectAll";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from "@mui/icons-material/Search";

import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";
import type { LibraryActionMode } from "../LibraryScreen";

export type LibraryItemActions = {
    editTags: (ids: ProblemId[]) => void
    deleteChecked: (confirmFn: () => boolean) => void
}

type LibraryViewProps = {
    ids: ProblemId[]
    query: ReturnType<typeof useLibraryQueryContext>
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
                <IconButton>
                    <SearchIcon />
                </IconButton>

                {/* ソート */}
                <LibrarySortControl
                    sort={query.sortState}
                    onSetSortKey={query.toggleSort}
                    onSetSortOrder={order => query.setSortState(p => ({ ...p, order }))}
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
                            onToggleCheckboxMode={alert}
                            onToggleChecked={selection.toggleChecked}
                        />
                    ))}
                </List>
            </Box>
        </>
    )
}
