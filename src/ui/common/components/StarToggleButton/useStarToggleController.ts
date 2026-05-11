import { useEffect, useState, useCallback } from "react"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

export type StarToggleController = {
    starred: boolean
    toggleStar: () => void
}
export function useStarToggleController(id: ProblemId, updateStore: boolean = true): StarToggleController{
    const problemToggleStar = useProblemStore(s=>s.toggleStar)
    const problem = useProblemStore(s=>s.byId[id])
     
    const [starred, setStarred] = useState(problem?.isStarred ?? false)

    useEffect(()=>{
        if (!problem) return
        setStarred(problem.isStarred)
    }, [problem])
    
    const toggleStar = useCallback(async () => {
            setStarred(prev => !prev)
            if (updateStore) problemToggleStar(id)
    }, [id])

    return {
        starred,
        toggleStar,
    }
}
