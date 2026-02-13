import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { IconButton, type Color } from "@mui/material"

import { useEffect, useState, useCallback } from "react"
import { Problem } from "@/domain/problem/Problem"
import { useStores } from "@/application/store/useStores"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"

export function useStarToggleButton(problem: Problem){
    const repos = useRepositoryContext()
    const [starred, setStarred] = useState(problem.starred)
    const toggleStar = useCallback(async () => {
            await repos.problem.update(problem.toggleStar())
    }, [problem.id])

    return {
        starred,
        toggleStar,
    }
}
