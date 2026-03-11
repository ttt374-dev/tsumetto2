import type { Move, Player } from "./entity"

const promotableTypes = new Set([
    "pawn",
    "lance",
    "knight",
    "silver",
    "bishop",
    "rook"
])
export const canPromote = (move: Move, player: Player) => {
    if (!move.from) return false
    if (!promotableTypes.has(move.pieceType)) return false

    const from = move.from.rank
    const to = move.to.rank

    if (player === "black") {
        return from <= 3 || to <= 3
    } else {
        return from >= 7 || to >= 7
    }
}