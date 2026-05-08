import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore"
import { useLibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection"

/////////////////////////////////////////////////
export function useLibraryViewModel() {
    const query = useProblemsQueryStore()
    const learningRecords = useLearningRecordStore(s => s.stateRecords)
    const problems = useProblemStore(selectActiveProblems)
    const ids = applyQuery(problems, learningRecords, query.state).map(p=>p.id)       
    const selection = useLibrarySelection(ids)      
    
    return {
        ids,
        query,
        selection,       
    }
}

