import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, List } from "@mui/material"
import { LibraryListItem } from "../library/components/LibraryListItem"


export function ListView({ ids, onSelectProblem, selectedProblemId }: {
    ids: ProblemId[],
    onSelectProblem?: (id: ProblemId) => void,
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
                    onItemClick={()=> onSelectProblem?.(id)}
                    selected={selectedProblemId === id}
                />
            ))}
        </List>
        </Box>
    )
}
