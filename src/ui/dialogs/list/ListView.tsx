import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, List } from "@mui/material"
import { LibraryListItem } from "../../screens/library/components/LibraryListItem"
import { useLibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection"


export function ListView({ ids, onItemClick, selectedProblemId }: {
    ids: ProblemId[],
    onItemClick?: (id: ProblemId) => void,
    selectedProblemId?: ProblemId
}) {

    const selection = useLibrarySelection(ids)
    
    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List>
            {ids.map(id => (
                <LibraryListItem
                    key={id}
                    id={id}
                    selection={selection}
                    onItemClick={()=> onItemClick?.(id)}
                    
                />
            ))}
        </List>
        </Box>
    )
}
