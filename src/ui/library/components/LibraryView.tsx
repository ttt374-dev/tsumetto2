import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Fab, List, Stack } from "@mui/material"

import type { Exercise } from "@/domain/Exercise/Exercise"
import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { AppLayout } from "../../common/AppLayout"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"

// LibraryView.tsx
export function LibraryView({
    items,
    query,
    onImportFiles,
    onDeleteAll,
    onSelect,
}: {
    items: Exercise[]
    query: ReturnType<typeof useLibraryQueryContext>
    onDeleteAll: () => void
    onSelect: (e: Exercise) => void
    onImportFiles: (files: File[]) => void
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
            <Stack direction="row">
                <Button onClick={onDeleteAll}>Delete all</Button>

                <LibrarySortControl
                    sort={query.sortState}
                    onSetSortKey={query.toggleSort}
                    onSetSortOrder={order =>
                        query.setSortState(p => ({ ...p, order }))
                    }
                />
            </Stack>

            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {items.map((e, i) => (
                        <LibraryListItem
                            key={e.problem.id}
                            exercise={e}
                            index={i}
                            onClick={() => onSelect(e)}
                        />
                    ))}
                </List>
            </Box>
            { inputElement }
        </AppLayout>
    )
}
