import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Checkbox, Fab, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';

import type { Exercise } from "@/domain/Exercise/Exercise"
import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { AppLayout } from "../../common/AppLayout"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import type { ProblemId } from "@/domain/problem/Problem"

// LibraryView.tsx
export function LibraryView({
    items,
    query,
    onImportFiles,

    isChecked,
    checkedIds,
    onToggleChecked,
    onDeleteAll,
    onDeleteChecked,
    onSelect,
}: {
    items: Exercise[]
    query: ReturnType<typeof useLibraryQueryContext>
    
    onSelect: (e: Exercise) => void
    onImportFiles: (files: File[]) => void
    isChecked: (id: ProblemId) => boolean,
    checkedIds: Set<ProblemId>,
    onToggleChecked: (id: ProblemId) => void,

    onDeleteAll: () => void
    onDeleteChecked: () => void
}) {
    // インポート用
    const { openFileDialog, inputElement, setOnFilesSelected } =
        useFileSelector(".kif")
    setOnFilesSelected(async files => {
        onImportFiles(Array.from(files))
    })
    return (
        <AppLayout
            header={"Library"}
            fab={
                <Fab onClick={openFileDialog}>
                    <AddIcon />
                </Fab>
            }
        >
            { /* 上部コントロール */ }
            <Stack direction="row">
                <IconButton
                    onClick={onDeleteChecked}
                    disabled={checkedIds.size === 0}
                >
                    <DeleteIcon />
                </IconButton>
                
                <Button onClick={onDeleteChecked}>Delete checked item</Button>
                <Button onClick={onDeleteAll}>Delete all</Button>
                <Box sx={{ flexGrow: 1 }} />
                <LibrarySortControl
                    sort={query.sortState}
                    onSetSortKey={query.toggleSort}
                    onSetSortOrder={order =>
                        query.setSortState(p => ({ ...p, order }))
                    }
                />
            </Stack>

            { /* リスト */ }
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {items.map((e, i) => (
                        <LibraryListItem
                            key={e.problem.id}
                            exercise={e}
                            onClick={() => onSelect(e)}
                            isChecked={isChecked(e.problem.id)}
                            onToggleChecked={() => { onToggleChecked(e.problem.id)}}
                        />
                    ))}
                </List>
            </Box>
            { inputElement }
        </AppLayout>
    )
}
