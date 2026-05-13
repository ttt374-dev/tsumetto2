import { useEffect, useState, useCallback } from "react"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

export type StarToggleController = {
    starred: boolean
    toggleStar: () => void
}
export function useProblemStar(
    id: ProblemId,
): StarToggleController {

    const toggleStoreStar =
        useProblemStore(s => s.toggleStar)

    const starred =
        useProblemStore(
            s => s.byId[id]?.isStarred ?? false
        )

    const toggleStar = useCallback(() => {
        toggleStoreStar(id)
    }, [id, toggleStoreStar])

    return {
        starred,
        toggleStar,
    }
}