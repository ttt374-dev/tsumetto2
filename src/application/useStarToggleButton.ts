import { useEffect, useState, useCallback } from "react"
import { Problem } from "@/domain/problem/Problem"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"

export function useStarToggleButton(problem: Problem){
    const repos = useRepositoryContext()
    const [starred, setStarred] = useState(problem.starred)
    const toggleStar = useCallback(async () => {
            setStarred(prev => !prev)
            await repos.problem.update(problem.toggleStar())
    }, [problem.id])

    return {
        starred,
        toggleStar,
    }
}
