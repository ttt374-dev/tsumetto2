import type { Move, Position } from "../entity";

export type BuildPositionResult =
    | { ok: true; value: Position }
    | { ok: false; error: unknown; ply: number; move: Move }

export function buildUntilPly(
    initialPosition: Position,
    moves: Move[],
    ply: number
): BuildPositionResult {
    let state = initialPosition

    for (let i = 0; i < ply; i++) {
        const move = moves[i]
        const res = move.apply(state)

        if (!res.ok) {
            return {
                ok: false,
                error: res.error,
                ply: i + 1,
                move,
            }
        }

        state = res.value
    }

    return { ok: true, value: state }
}