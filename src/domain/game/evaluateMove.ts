import type { Move } from "@/domain/kif/entity"

export type EvaluationResult =
  | { type: "correct" }
  | { type: "incorrect" }
  | { type: "solved" }

export function evaluateMove(move: Move, moves: Move[], ply: number): EvaluationResult {
    if (!move.equals(moves[ply])) return { type: "incorrect" }
    if (ply + 1 >= moves.length) return { type: "solved" }
    return { type: "correct"}
}
