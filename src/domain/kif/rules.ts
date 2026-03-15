import { type Move, type Piece, type PieceType, type Square } from "./entity"

export const PromotablePieceType = ["pawn","lance","knight","silver","bishop","rook"] as const

export function isPromotable(pieceType: PieceType): boolean {
    const set = new Set<PieceType>(PromotablePieceType)
    return set.has(pieceType)
}

export function isSquareNumber(n: number): boolean {
    return n >= 1 && n <= 9
}

export const canPromote = (from: Square, to: Square, piece: Piece) => {
    if (!isPromotable(piece.type)) return false
    if (piece.promoted) return false
    
    if (piece.owner === "black") {
        return from.rank <=3 || to.rank <= 3
    } else {
        return from.rank >= 7 || to.rank >= 7
    }
}

export function isSameMove(a: Move, b: Move): boolean {
    //console.log("samemove" ,a, b )
    return a.from?.file === b.from?.file &&
        a.from?.rank === b.from?.rank &&
        a.to.file === b.to.file &&
        a.to.rank === b.to.rank &&
        a.promote === b.promote &&
        a.pieceType === b.pieceType
}