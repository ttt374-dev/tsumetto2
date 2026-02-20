import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { List } from "@mui/material"
import { LibraryListItem } from "../library/components/LibraryListItem"


export function ListView({ ids, onSelectProblem, currentProblemId }: {
    ids: ProblemId[],
    onSelectProblem?: (id: ProblemId) => void,
    currentProblemId?: ProblemId
}) {

    return (
        <List>
            {ids.map(id => (
                <LibraryListItem
                    key={id}
                    id={id}
                    showCheckbox={false}
                    isChecked={false}
                    onToggleChecked={alert}
                    onItemClick={()=> onSelectProblem?.(id)}
                    selected={currentProblemId === id}
                />
            ))}
        </List>
    )
}
