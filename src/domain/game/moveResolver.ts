import type { Move } from "../kif/entity"
import { isSameMove } from "../kif/rules"

export type MoveResult =
  | { type: "incorrect" }
  | { type: "playerMove" }
  | { type: "solved" }
  | { type: "playerAndOpponent" }

export function resolveMove(moves: Move[], ply: number, move: Move): MoveResult {
    console.log("resolve move", moves[ply], move)
    if (!isSameMove(moves[ply], move)) {
        return { type: "incorrect" }
    }
    const nextPly = ply + 1

    if (nextPly >= moves.length) {
        return { type: "solved" }
    }

    return { type: "playerAndOpponent" }
}