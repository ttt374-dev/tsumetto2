
import { Box, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";

type LibraryViewProps = {
    ids: ProblemId[]
    query: ReturnType<typeof useLibraryQueryContext>
    itemActions: {
        editTags: (ids: ProblemId[]) => void
        deleteChecked: (confirmFn: () => boolean) => void
    },

    selection: {
        checkedIds: ProblemId[]
        isChecked: (id: ProblemId) => boolean
        isCheckboxMode: boolean

        selectAll: () => void
        clearAll: () => void
        toggleChecked: (id: ProblemId) => void
        toggleCheckboxMode: () => void
    }
    onItemClick: (p: Problem) => void
}

/////////////////////////////////////////
export function LibraryView({ids, query,
    itemActions, onItemClick, selection}: LibraryViewProps) {

    const confirmFn = () => window.confirm("Are you sure to delete selected?")

    return (
        <>
            <Stack direction="row">

                {selection.isCheckboxMode &&
                    <Stack direction="row">
                        <LibraryCheckboxControl
                            onCheckAll={selection.selectAll}
                            onUncheckAll={selection.clearAll}
                            onToggleCheckboxMode={selection.toggleCheckboxMode}
                        />
                        { /* 削除ボタン */}
                        <IconButton
                            onClick={() =>
                                itemActions.deleteChecked(confirmFn)}
                            disabled={selection.checkedIds.length === 0}
                        >
                            <DeleteIcon />
                        </IconButton>
                        { /* タグ編集 */}
                        <IconButton
                            onClick={() => itemActions.editTags(Array.from(selection.checkedIds))}>
                            <EditIcon />
                        </IconButton>
                    </Stack>
                }

                <Box sx={{ flexGrow: 1 }} />

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
                            //problem={p}
                            id={id}
                            showCheckbox={selection.isCheckboxMode}
                            onItemClick={onItemClick}
                            isChecked={selection.isChecked(id)}
                            onToggleCheckboxMode={selection.toggleCheckboxMode}
                            onToggleChecked={selection.toggleChecked}
                        />
                    ))}
                </List>
            </Box>
        </>
    )
}
