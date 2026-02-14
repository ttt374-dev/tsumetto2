import type { Problem, ProblemId } from "@/domain/problem/Problem"
import { List } from "@mui/material"
import { LibraryListItem } from "../library/components/LibraryListItem"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import { useStores } from "@/application/store/useStores"
import { useEffect } from "react"


export function ListView({ ids, onSelectProblem, currentProblemId }: {
    ids: ProblemId[],
    onSelectProblem?: (id: ProblemId) => void,
    currentProblemId?: ProblemId
}) {
    const repos = useRepositoryContext()

    return (
        <List>
            {ids.map(id => (
                <LibraryListItem
                    key={id}
                    id={id}
                    //learning={learningRecords[id]}
                    showCheckbox={false}
                    isChecked={false}
                    onToggleChecked={alert}
                    onToggleCheckboxMode={alert}
                    onItemClick={()=> onSelectProblem?.(id)}
                    selected={currentProblemId === id}
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