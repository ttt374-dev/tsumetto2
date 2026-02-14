
import { Box, Button, Checkbox, Fab, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { LearningRecord } from "@/domain/learning/Learning";
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";

type LibraryViewProps = {
    //problems: Problem[]
    ids: ProblemId[]
    //learningRecords: LearningRecord
    query: ReturnType<typeof useLibraryQueryContext>
    itemActions: {
        editTags: (ids: ProblemId[]) => void
        deleteChecked: () => void
    },
    selectActions: {
        onSelectAll: () => void
        onClearAll: () => void
        onToggleChecked: (id: ProblemId) => void
        onToggleCheckboxMode: () => void
    }
    selection: {
        checkedIds: ProblemId[]
        isChecked: (id: ProblemId) => boolean
        isCheckboxMode: boolean
    }
    onItemClick: (p: Problem) => void
}


/////////////////////////////////////////
export function LibraryView({ids, query,
    itemActions, selectActions, onItemClick, selection}: LibraryViewProps) {

    return (
        <>
            <Stack direction="row">

                {selection.isCheckboxMode &&
                    <Stack direction="row">
                        <LibraryCheckboxControl
                            onCheckAll={selectActions.onSelectAll}
                            onUncheckAll={selectActions.onClearAll}
                            onToggleCheckboxMode={selectActions.onToggleCheckboxMode}
                        />
                        { /* 削除ボタン */}
                        <IconButton
                            onClick={() =>
                                itemActions.deleteChecked()}
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
                            onToggleCheckboxMode={selectActions.onToggleCheckboxMode}
                            onToggleChecked={selectActions.onToggleChecked}
                        />
                    ))}
                </List>
            </Box>
        </>
    )
}
