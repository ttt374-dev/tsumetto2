import type { Move } from "@/domain/kif/entity"

export function evaluateMove(move: Move, moves: Move[], ply: number) {
    if (!move.equals(moves[ply])) return "incorrect"
    if (ply + 1 >= moves.length) return "solved"
    return "correct"
}
