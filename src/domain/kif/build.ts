import type { BoardState } from "./BoardState";
import type { Move } from "./Move";

function buildUntilPly(
    initial: BoardState,
    moves: readonly Move[],
    ply: number
): BoardState {
    const safePly = Math.max(0, Math.min(ply, moves.length))

    return moves
        .slice(0, safePly)
        .reduce(
            (state, move) => move.apply(state),
            initial
        )
}