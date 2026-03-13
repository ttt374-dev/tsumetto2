import type { Move, Piece, Square } from "./entity"

const promotableTypes = new Set([
    "pawn", "lance", "knight", "silver", "bishop", "rook"])

export const canPromote = (from: Square, to: Square, piece: Piece) => {
    if (!promotableTypes.has(piece.type)) return false
    if (piece.promoted) return false
    
    if (piece.owner === "black") {
        return from.rank <=3 || to.rank <= 3
    } else {
        return from.rank >= 7 || to.rank >= 7
    }

}

export function sameMove(a: Move, b: Move): boolean {
    console.log("samemove" ,a, b )
    return a.from?.file === b.from?.file &&
        a.from?.rank === b.from?.rank &&
        a.to.file === b.to.file &&
        a.to.rank === b.to.rank &&
        a.promote === b.promote &&
        a.pieceType === b.pieceType
}