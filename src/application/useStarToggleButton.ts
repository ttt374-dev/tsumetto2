import { useEffect, useState, useCallback } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { useProblemStore } from "./store/useProblemStore"

export function useStarToggleButton(id: ProblemId){
    const problemToggleStar = useProblemStore(s=>s.toggleStar)
    const problem = useProblemStore(s=>s.byId[id])
     
    const [starred, setStarred] = useState(problem?.starred ?? false)
    const toggleStar = useCallback(async () => {
            setStarred(prev => !prev)
            problemToggleStar(id)
    }, [id])

    return {
        starred,
        toggleStar,
    }
}
