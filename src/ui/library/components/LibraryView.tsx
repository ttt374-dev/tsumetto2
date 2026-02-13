
import { Box, Button, Checkbox, Fab, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { LearningRecord } from "@/domain/learning/Learning";
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";

export type LibraryViewHandlers = {
    view: { onViewProblem: (p: Problem) => void }
    edit: { 
        onEditTags: (ids: ProblemId[]) => void,
    },
    import: { onOpenImportFileDialog: () => void }
    delete: { onDeleteMany: (ids: ProblemId[]) => void }
    checkbox: {
        onCheckAll: () => void
        onUncheckAll: () => void
        onToggleChecked: (id: ProblemId) => void        
    },
    mode: { onToggleCheckboxMode: () => void }
}

export type LibrarySelection = {
    //checkedIds: Set<ProblemId>
    checkedIds: ProblemId[]
    isChecked: (id: ProblemId) => boolean
    isCheckboxMode: boolean
}

export type LibraryViewProps = {
    problems: Problem[]
    learningRecords: LearningRecord
    query: ReturnType<typeof useLibraryQueryContext>
    handlers: LibraryViewHandlers
    selection: LibrarySelection
}

/////////////////////////////////////////
export function LibraryView({
    problems,
    learningRecords,
    query,
    handlers,
    selection
}: LibraryViewProps) {
   
    const onItemClick = (p: Problem) => {
        if (selection.isCheckboxMode) {
            handlers.checkbox.onToggleChecked(p.id)
        } else {
            handlers.view.onViewProblem(p)
        }
    }

    return (
        <>
            <Stack direction="row">
                <LibraryCheckboxControl
                    onCheckAll={handlers.checkbox.onCheckAll}
                    onUncheckAll={handlers.checkbox.onUncheckAll}
                    onToggleCheckboxMode={handlers.mode.onToggleCheckboxMode}
                    isCheckboxMode={selection.isCheckboxMode}
                />

                {selection.isCheckboxMode &&
                <>
                    { /* 削除ボタン */}
                    <IconButton
                        onClick={()=>handlers.delete.onDeleteMany(selection.checkedIds)}
                        disabled={selection.checkedIds.length === 0}
                    >
                        <DeleteIcon />
                    </IconButton>
                    { /* タグ編集 */}
                    <IconButton
                        onClick={()=>handlers.edit.onEditTags(Array.from(selection.checkedIds))}>
                        <EditIcon/>
                    </IconButton>
                  </>  
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
                    {problems.map(p => (
                        <LibraryListItem
                            key={p.id}
                            problem={p}
                            learning={learningRecords[p.id]}
                            isCheckboxMode={selection.isCheckboxMode}
                            onClick={onItemClick}
                            isChecked={selection.isChecked(p.id)}
                            onToggleCheckboxMode={handlers.mode.onToggleCheckboxMode}
                            onToggleChecked={handlers.checkbox.onToggleChecked}
                        />
                    ))}
                </List>
            </Box>
        </>
    )
}
