import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { useParams } from "react-router-dom"

type SessionPlayerValidationInput = {
    sessionId?: string
    index?: string
    ids: ProblemId[]
    problemMap: Record<string, Problem | undefined>
}

type SessionPlayerValidationResult = 
    | { type: "error", message: string}
    | { type: "ready", problem: Problem, sessionId: SessionId, currentIndex: number}

//////////////////////////////////
export function useSessionPlayerValidation(): SessionPlayerValidationResult {
    const { sessionId, index } = useParams<{ sessionId: string, index: string }>()

    const ids = useSessionStore(s => s.problemIds)
    const byId = useProblemStore(s => s.byId)
    const input: SessionPlayerValidationInput = {
        sessionId,
        index,
        ids,
        problemMap: byId
    }
    return validateSessionPlayer(input)
}
///////////////////////////////////////////

export function validateSessionPlayer(input: SessionPlayerValidationInput): SessionPlayerValidationResult {
    const { sessionId, index, ids, problemMap } = input

    if (!sessionId) {
        return { type: "error", message: "Invalid sessionId" }
    }

    if (index === undefined) {
        return { type: "error", message: "index is required" }
    }

    const currentIndex = Number(index)
    if (Number.isNaN(currentIndex) || currentIndex < 0) {
        return { type: "error", message: "invalid currentIndex" }
    }

    if (!ids.length || currentIndex >= ids.length) {
        return { type: "error", message: "Invalid index" }
    }

    const pid = ids[currentIndex]
    const problem = pid ? problemMap[pid] : undefined

    if (!problem) {
        return { type: "error", message: `Problem not found: ${pid}` }
    }

    return {
        type: "ready",
        problem,
        sessionId,
        currentIndex,
    }
}