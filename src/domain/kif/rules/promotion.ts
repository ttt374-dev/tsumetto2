import { isPromotablePieceType, Position, type Move, type Piece, type PieceType, type Square } from "../entity"

/*
export const PromotablePieceType = ["pawn","lance","knight","silver","bishop","rook"] as const

export function isPromotable(pieceType: PieceType): boolean {
    const set = new Set<PieceType>(PromotablePieceType)
    return set.has(pieceType)
}*/
export const canPromote = (from: Square, to: Square, piece: Piece) => {
    if (!isPromotablePieceType(piece.type)) return false
    if (piece.promoted) return false
    
    if (piece.owner === "black") {
        return from.rank <=3 || to.rank <= 3
    } else {
        return from.rank >= 7 || to.rank >= 7
    }
}
