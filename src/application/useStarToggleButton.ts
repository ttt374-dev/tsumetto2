import { useEffect, useState, useCallback } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { useProblemStore } from "./store/useProblemStore"

export function useStarToggleButton(id: ProblemId, updateStore: boolean = true){
    const problemToggleStar = useProblemStore(s=>s.toggleStar)
    const problem = useProblemStore(s=>s.byId[id])
     
    const [starred, setStarred] = useState(problem?.starred ?? false)

    useEffect(()=>{
        if (!problem) return
        setStarred(problem.starred)
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
