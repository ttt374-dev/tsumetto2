import { Move, Piece, type PieceType, type Position, type Square } from "@/domain/kif/entity";
import type { PendingPromotion } from "@/ui/player/hooks/useGameStore";
import { isValidMove } from "../kif/rules/validMove";
import { canPromote } from "../kif/rules/promotion";

//////////
export type Intent =    // ユーザのアクション
    | { type: "move"; from: Square; to: Square }
    | { type: "drop"; pieceType: PieceType; to: Square }
    | { type: "choosePromotion"; promote: boolean}

export type IntentResult =   // ゲームエンジンの状態
    | { type: "move", move: Move}
    | { type: "promotionPending", pendingPromotion: PendingPromotion}

export function resolveIntent(position: Position, intent: Intent): IntentResult | null {
    if (intent.type === "move") {
        return resolveBoardMoveIntent(position, intent.from, intent.to)
    }

    if (intent.type === "drop") {
        return resolveDropIntent(position, intent.pieceType, intent.to)
    }
    return null}

function resolveBoardMoveIntent(
    position: Position,
    from: Square,
    to: Square
): IntentResult | null {
    const piece = position.board.get(from)
    if (!piece) return null
    const move = new Move(from, to, piece.type, piece.promoted)    
    if (!isValidMove(position, move)) return null

    // 手番チェック
    //if (piece.owner !== position.sideToMove) return null

    // 行き先に自分の駒
    //const target = position.board.get(to.file, to.rank)
    //if (target && target.owner === piece.owner) return null

    // 駒の移動ルール
    //if (!canMove(piece, from, to, position.board)) return null

    //let promote = piece.promoted       
    if (canPromote(from, to, piece)){
        return { type: "promotionPending", pendingPromotion: { from, to, pieceType: piece.type}}
    }
    //const promote = true // TODO
    
    
    return { type: "move", move: move}
}

function resolveDropIntent(
    position: Position,
    pieceType: PieceType,
    to: Square
): IntentResult | null {
    
    // 空きマスチェック
    //if (position.board.get(to.file, to.rank)) return null

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

    const move = new Move(null, to, pieceType)    
    if (!isValidMove(position, move)) return null
    return { type: "move", move: move}
}