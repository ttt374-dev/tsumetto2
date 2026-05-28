import type { ApplyMoveError, Move, Position } from "../entity";

export type BuildPositionResult =
    | { ok: true; value: Position }
    | { ok: false; error: ApplyMoveError; ply: number; move: Move, value: Position }

export function buildUntilPly(
    initialPosition: Position,
    moves: Move[],
    ply: number
): BuildPositionResult {
    let state = initialPosition

    for (let i = 0; i < ply; i++) {
        const move = moves[i]
        //const res = move.apply(state)
        const res = state.applyMove(move)
        if (!res.ok) {
            return {
                ok: false,
                error: res.error,
                ply: i + 1,
                move,
                value: state
            }
        }

        state = res.value
    }

    return { ok: true, value: state }
}