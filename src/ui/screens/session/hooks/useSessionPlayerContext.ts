import { parseSessionParams } from "@/ui/screens/session/hooks/parseSessionParams"
import { useParams } from "react-router-dom"

import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";

export type SessionPlayerContext = 
    | { type: "ready", sessionId: string, index: number, problem: Problem}
    | { type: "error", message?: string}

export function useSessionPlayerContext(): SessionPlayerContext {
    const params = useParams<{ sessionId: string, index: string }>()
    const resParams = parseSessionParams(params)

    const ids = useSessionStore(s => s.problemIds)
    const byId = useProblemStore(s => s.byId)
    const activeSessionId = useSessionStore(s => s.activeSessionId)  


    // validation
    if (resParams.type === "invalid")
        return { type: "error", message: "invalid params"}

    const { sessionId, index } = resParams

    if (index < 0) {
        return { type: "error", message: "invalid currentIndex" }
    }
    if (!ids.length || index >= ids.length) {
        return { type: "error", message: "Invalid index" }
    }
    const pid = ids[index]
    const problem = pid ? byId[pid] : undefined
    if (!problem) {
        return { type: "error", message: `Problem not found: ${pid}` }
    }
    if (activeSessionId !== sessionId){
        return { type: "error", message: `current sessoin Id is not active: ${sessionId} vs active of ${activeSessionId}` }
    }

    return { type: "ready",
        sessionId, index, problem,
    }

}
