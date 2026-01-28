
import { Box, Button, Checkbox, Fab, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';

import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { AppLayout } from "../../common/AppLayout"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { LearningRecord } from "@/domain/learning/Learning";
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";


export type LibraryViewHandlers = {
    view: { onViewProblem: (id: ProblemId) => void }
    import: { onOpenImportFileDialog: () => void }
    delete: { onDeleteAll: () => void; onDeleteChecked: () => void }
    checkbox: {
        onCheckAll: () => void
        onUncheckAll: () => void
        onToggleChecked: (id: ProblemId) => void
        onToggleCheckboxMode: () => void
    }
}

export type LibrarySelection = {
    checkedIds: Set<ProblemId>
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


    const handleItemClick = (id: string) => {
        if (selection.isCheckboxMode) {
            handlers.checkbox.onToggleChecked(id)
        } else {
            handlers.view.onViewProblem(id)
        }
    }

    return (
        <>
            <Stack direction="row">
                <LibraryCheckboxControl
                    onCheckAll={handlers.checkbox.onCheckAll}
                    onUncheckAll={handlers.checkbox.onUncheckAll}
                    onToggleCheckboxMode={handlers.checkbox.onToggleCheckboxMode}
                    isCheckboxMode={selection.isCheckboxMode}
                />

                {selection.isCheckboxMode &&
                    <IconButton
                        onClick={handlers.delete.onDeleteChecked}
                        disabled={selection.checkedIds.size === 0}
                    >
                        <DeleteIcon />
                    </IconButton>
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
                            onClick={() => handleItemClick(p.id)}
                            isChecked={selection.isChecked(p.id)}
                            onToggleChecked={() => handlers.checkbox.onToggleChecked(p.id)}
                        />
                    ))}
                </List>
            </Box>

        </>
    )
}
