import type { Move } from "@/domain/kif/entity"

export type EvaluationResult =
    | { type: "correct" }
    | { type: "incorrect" }
    | { type: "solved" }

//export function evaluateMove(move: Move, moves: Move[], ply: number): EvaluationResult {
export function evaluateMove(props: {
    move: Move, moves: Move[], ply: number
}
): EvaluationResult {
    if (!props.move.equals(props.moves[props.ply])) return { type: "incorrect" }
    if (props.ply + 1 >= props.moves.length) return { type: "solved" }
    return { type: "correct" }
}
