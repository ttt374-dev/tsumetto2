import type { Move, Piece, PieceType, Player, Square } from "./entity"

const promotableTypes = new Set([
    "pawn",
    "lance",
    "knight",
    "silver",
    "bishop",
    "rook"
])
export const canPromote = (to: Square, piece: Piece) => {
    if (!promotableTypes.has(piece.type)) return false
    if (piece.promoted) return false
    
    if (piece.owner === "black") {
        return to.rank <= 3
    } else {
        return to.rank >= 7
    }

}
export const canPromote222 = (move: Move, player: Player) => {
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