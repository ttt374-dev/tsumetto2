import type { NavigateFunction} from "react-router-dom"

import type { SessionEffect } from "@/application/session/resolveSessionCommand"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/types/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"


export function runSessionEffects(
    effects: SessionEffect[],
    deps: {
        navigate: NavigateFunction
        appendReview: (problemId: ProblemId, sessionId: SessionId, quality: SolvedResult) => void
    }
) {
    for (const effect of effects) {
        switch (effect.type) {
            case "NAVIGATE":
                deps.navigate(effect.to)
                break
            case "APPEND_REVIEW":
                deps.appendReview(effect.problemId,effect.sessionId, effect.solvedResult)
                break;
            default:
                const _exhaustive: never = effect
                throw new Error("Unknown effect")        
        }
    }
}

