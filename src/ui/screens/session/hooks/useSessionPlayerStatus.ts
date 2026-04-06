import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session";

export type SessionPlayerStatus =
    | { status: "idle"}
    | { status: "finished"}
    | { status: "active", problem: Problem, sessionId: SessionId, index: number}

export function useSessionPlayerStatus(): SessionPlayerStatus {
    const problemIds = useSessionStore(s => s.problemIds)
    const index = useSessionStore(s => s.currentIndex)
    const sessionId = useSessionStore(s=>s.sessionId)
    const currentProblemId: ProblemId | undefined = problemIds[index]
    const count = problemIds.length
    
    //const problem: Problem = useProblemStore(s => s.byId[currentProblemId])
    const problem = useProblemStore(s =>
       currentProblemId ? s.byId[currentProblemId] : undefined)

    /*
    if (count === 0) {
        return { status: "idle" }
    }

    if (index >= count || !currentProblemId) {
        return { status: "finished" }
    }  */

    if (!sessionId || count === 0) {
        return { status: "idle" }
    }

    if (index >= count) {
        return { status: "finished" }
    }

    if (!problem) {
        return { status: "idle" }
    }
    return { status: "active", problem, sessionId, index}   
}