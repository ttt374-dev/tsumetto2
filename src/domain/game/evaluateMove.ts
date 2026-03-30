import type { Move } from "@/domain/kif/entity"

export type EvaluationResult =
    | { type: "correct-ongoing" }    
    | { type: "correct-solved" }
    | { type: "incorrect" }

//export function evaluateMove(move: Move, moves: Move[], ply: number): EvaluationResult {
export function evaluateMove(props: {
    move: Move, moves: Move[], ply: number
}
): EvaluationResult {
    if (!props.move.equals(props.moves[props.ply])) return { type: "incorrect" }
    if (props.ply + 1 >= props.moves.length) return { type: "correct-solved" }
    return { type: "correct-ongoing" }
}
