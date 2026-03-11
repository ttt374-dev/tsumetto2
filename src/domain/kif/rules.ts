import type { Piece, Square } from "./entity"

const promotableTypes = new Set([
    "pawn", "lance", "knight", "silver", "bishop", "rook"])
export const canPromote = (to: Square, piece: Piece) => {
    if (!promotableTypes.has(piece.type)) return false
    if (piece.promoted) return false
    
    if (piece.owner === "black") {
        return to.rank <= 3
    } else {
        return to.rank >= 7
    }

}
