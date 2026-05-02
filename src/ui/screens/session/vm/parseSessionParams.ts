import type { SessionId } from "@/domain/session/entity/Session"

export type ParseSessionParamsResult =
    | { type: "invalid" }
    | { type: "valid", sessionId: SessionId, index: number }


export function parseSessionParams(input: {
    sessionId?: string
    index?: string
}): ParseSessionParamsResult {
    if (!input.sessionId) return { type: "invalid" }

    const index = Number(input.index)
    if (Number.isNaN(index)) return { type: "invalid" }

    return {
        type: "valid",
        sessionId: input.sessionId,
        index
    }
}
