import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { IconButton, type Color } from "@mui/material"

import { useEffect, useState, useCallback } from "react"
import { Problem } from "@/domain/problem/Problem"
import { useStores } from "@/application/store/useStores"

export function useStarController(problem: Problem) {
    const { problem: problemStore } = useStores()

    const [starred, setStarred] = useState(problem.starred)
    const [updating, setUpdating] = useState(false)

    // problemが切り替わったら同期
    useEffect(() => {
        setStarred(problem.starred)
    }, [problem.id, problem.starred])

    const toggleStar = useCallback(async () => {
        if (updating) return

        const next = !starred

        // optimistic update
        setStarred(next)
        setUpdating(true)

        try {
            await problemStore.updateProblem(problem.toggleStar())
        } catch (e) {
            // rollback
            setStarred(!next)
            console.error("failed to update star", e)
        } finally {
            setUpdating(false)
        }
    }, [problem, starred, updating, problemStore])

    return {
        starred,
        toggleStar,
        updating,
    }
}
