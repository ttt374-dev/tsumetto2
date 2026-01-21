import type { Exercise } from "@/domain/Exercise/Exercise"
import type { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { AppLayout } from "../../common/AppLayout"
import { Box, Button, List, Stack } from "@mui/material"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"

// LibraryView.tsx
export function LibraryView({
    items,
    query,
    onImport,
    onDeleteAll,
    onSelect,
}: {
    items: Exercise[]
    query: ReturnType<typeof useLibraryQueryContext>
    onImport: () => void
    onDeleteAll: () => void
    onSelect: (e: Exercise) => void
}) {
    return (
        <AppLayout>
            <Stack direction="row">
                <Button onClick={onImport}>Import</Button>
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
        </AppLayout>
    )
}
