import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, List, Stack } from "@mui/material"
import { LibraryListItem } from "./LibraryListItem"
import { useLibrarySelection, type LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection"


export function LibraryListView({ ids, selection, onItemClick }: {
    ids: ProblemId[],
    selection?: LibrarySelection,
    onItemClick: (pid: ProblemId) => void,
}) {
    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <List>
                {ids.map(id => (
                    <LibraryListItem
                        key={id}
                        id={id}
                        selection={selection}
                        onItemClick={onItemClick}
                    />
                ))}
            </List>
        </Box>
    )
}
