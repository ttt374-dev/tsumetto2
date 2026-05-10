import type { SessionId } from "@/domain/session/entity/Session"

export type ParseSessionParamsResult =
    | { type: "invalid", message?: string }
    | { type: "valid", sessionId: SessionId, index: number }


export function parseSessionParams(input: {
    sessionId?: string
    index?: string
}): ParseSessionParamsResult {
    if (!input.sessionId) return { type: "invalid", message: "invalid SessionID" }

    const index = Number(input.index)
    if (Number.isNaN(index)) return { type: "invalid", message: "invalied index" }

    return {
        type: "valid",
        sessionId: input.sessionId,
        index
    }
}
    