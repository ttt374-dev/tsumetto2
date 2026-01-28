import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { List } from "@mui/material"
import { LibraryListItem } from "../library/components/LibraryListItem"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"


export function ListView({ problems, onSelectProblem, currentProblemId }: {
    problems: Problem[],
    onSelectProblem?: (id: ProblemId) => void,
    currentProblemId?: ProblemId
}) {
    const repos = useRepositoryContext()
    const learningRecords = useLearningEventStore(repos.learningEvent).records

    

    return (
        <List>
            {problems.map(p => (
                <LibraryListItem
                    key={p.id}
                    problem={p}
                    learning={learningRecords[p.id]}
                    isCheckboxMode={false}
                    isChecked={false}
                    onToggleChecked={alert}
                    onToggleCheckboxMode={alert}
                    onClick={()=> onSelectProblem?.(p.id)}
                    selected={currentProblemId === p.id}
                />
            ))}
        </List>
    )
}
/*
export function ListScreen({}: {}){
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const missionStore = useMissionEventStoreContext()
    const ids = missionStore.snapshot?.problemIds
    if (!ids) return (<>null ids</>)
    const problems = ids.map(id => problemStore.findById(id)).filter(p => p !== undefined)
    return (
        <ListView problems={problems}/>
    )
}
*/