import { Move, type PieceType, type Position, type Square } from "@/domain/kif/entity";

export type Intent =
    | { type: "move"; from: Square; to: Square }
    | { type: "drop"; pieceType: PieceType; to: Square }


export function resolveIntent(
    position: Position,
    intent: Intent
): Move | null {

    if (intent.type === "move") {
        return resolveBoardMove(position, intent.from, intent.to)
    }

    if (intent.type === "drop") {
        return resolveDrop(position, intent.pieceType, intent.to)
    }

    return null
}

function resolveBoardMove(
    position: Position,
    from: Square,
    to: Square
): Move | null {

    const piece = position.board.get(from.file, from.rank)

    if (!piece) return null

    // 手番チェック
    if (piece.owner !== position.sideToMove) return null

    // 行き先に自分の駒
    const target = position.board.get(to.file, to.rank)
    if (target && target.owner === piece.owner) return null

    // 駒の移動ルール
    //if (!canMove(piece, from, to, position.board)) return null

    //const promote = shouldPromote(piece, from, to)
    const promote = true // TODO
    return new Move(from, to, piece.type, promote)    
}

function resolveDrop(
    position: Position,
    pieceType: PieceType,
    to: Square
): Move | null {

    // 空きマスチェック
    if (position.board.get(to.file, to.rank)) return null

    // 持ち駒チェック
    //if (!hasHand(position.hands, position.sideToMove, piece)) {
    //    return null
    //}

    // 二歩チェック
    //if (piece === "pawn") {
    //    if (isNifu(position.board, position.sideToMove, to.file)) {
    //        return null
    //    }
    //}

    return new Move(null, to, pieceType)    
}