import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, List } from "@mui/material"
import { LibraryListItem } from "../../screens/library/components/LibraryListItem"


export function ListView({ ids, onItemClick, selectedProblemId }: {
    ids: ProblemId[],
    onItemClick?: (id: ProblemId) => void,
    selectedProblemId?: ProblemId
}) {

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List>
            {ids.map(id => (
                <LibraryListItem
                    key={id}
                    id={id}
                    showCheckbox={false}
                    isChecked={false}
                    onToggleChecked={alert}
                    onItemClick={()=> onItemClick?.(id)}
                    selected={selectedProblemId === id}
                    onChangeActionMode={alert}
                />
            ))}
        </List>
        </Box>
    )
}
