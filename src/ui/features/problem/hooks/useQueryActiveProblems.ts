import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { DefaultQueryState, type QueryState } from "@/domain/problem/service/query/QueryState"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

///////
// helper
export function useQueryActiveProblems(queryState: Partial<QueryState>){
    const activeProblems = useProblemStore(selectActiveProblems)
    const records = useLearningRecordStore(s=>s.stateRecords)  
    //console.log("querystate", queryState)  
    return applyQuery(activeProblems, records, {...DefaultQueryState, ...queryState})
}
