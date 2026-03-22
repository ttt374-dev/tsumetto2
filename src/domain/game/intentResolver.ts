import { Move, Piece, Square, type PieceType, type Position } from "@/domain/kif/entity";
import type { PendingPromotion } from "@/ui/player/hooks/useGameStore";
import { canPromote } from "../kif/rules/promotion";
import { generateValidMovesFrom } from "../kif/rules/validMoveGenerator";

//////////
export type Intent =    // ユーザのアクション
    | { type: "move"; from: Square; to: Square, promote: boolean }
    | { type: "drop"; pieceType: PieceType; to: Square }
    //| { type: "choosePromotion"; promote: boolean}

export type IntentResult =   // ゲームエンジンの状態
    | { type: "move", move: Move}
    | { type: "promotionPending", pendingPromotion: PendingPromotion}
    | { type: "error", message: string | undefined}

export function resolveIntent(position: Position, intent: Intent): IntentResult | null {
    if (intent.type === "move") {
        return resolveBoardMoveIntent(position, intent.from, intent.to, intent.promote)
    }

    if (intent.type === "drop") {
        return resolveDropIntent(position, intent.pieceType, intent.to)
    }
    return null}

function resolveBoardMoveIntent(
    position: Position,
    from: Square,
    to: Square,
    promote: boolean
): IntentResult | null {
    const piece = position.board.get(from)
    if (!piece) return null
    const move = new Move(from, to, piece.type, piece.promoted)
    console.log("resolve move intent", promote, move) 

    // 手番チェック
    if (piece.owner !== position.sideToMove) return null

    // 行き先に自分の駒
    const target = position.board.get(new Square(to.file, to.rank))
    if (target && target.owner === piece.owner) return null

    // 駒の移動ルール
    const validMoves = generateValidMovesFrom(position, from)
    const isValid = validMoves.some(m => m.to.file == to.file && m.to.rank === to.rank && m.promote === promote);
    if (!isValid) {
        console.log("invalid move", from, to, piece)
        return null
    }
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
    if (position.board.get(to)) return null

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
    //if (!isValidMove(position, move)) return null
    return { type: "move", move: move}
}