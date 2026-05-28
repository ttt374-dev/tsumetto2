import { useEffect, useState, useCallback } from "react"
import { Problem, type ProblemId } from "@/domain/problem/entity/Problem"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useProblemMutation } from "@/ui/features/problem/hooks/useProblemMutation"

export type StarToggleController = {
    starred: boolean
    toggleStar: () => void
}
export function useProblemStar(id: ProblemId): StarToggleController {
    const { toggleStar: toggleStarMutation } = useProblemMutation()

    const starred = useProblemStore(s => s.byId[id]?.isStarred ?? false)
    
    return {
        starred,
        toggleStar: () => toggleStarMutation(id),
    }
}