import { Move, Piece, Square, type PieceType, type Position } from "@/domain/kif/entity";
import type { PendingPromotion } from "@/ui/player/hooks/useGameStore";
import { canPromote } from "../kif/rules/promotion";
import { generateValidMovesFrom } from "../kif/rules/validMoveGenerator";

//////////
export type Intent =    // ユーザのアクション
    | { type: "move"; from: Square; to: Square, promote: boolean }
    | { type: "drop"; pieceType: PieceType; to: Square }
    | { type: "choosePromotion"; promote: boolean}    

export type IntentResult =   // ゲームエンジンの状態
    | { type: "move", move: Move}
    | { type: "promotionPending", pendingPromotion: PendingPromotion}
    | { type: "invalidMove"; reason?: string}

export function resolveIntent(position: Position, intent: Intent): IntentResult{
    if (intent.type === "move") {
        return resolveBoardMoveIntent(position, intent.from, intent.to, intent.promote)
    }
    if (intent.type === "drop") {
        return resolveDropIntent(position, intent.pieceType, intent.to)
    }    
    //alert("res intent null")
    throw new Error("should not reach here")
    //return null
}


function resolveBoardMoveIntent(
    position: Position,
    from: Square,
    to: Square,
    promote: boolean
): IntentResult {
    const piece = position.board.get(from)
    if (!piece) throw new Error("piece not there")    

    // 手番チェック
    if (piece.owner !== position.sideToMove) return { type: "invalidMove", reason: "not own turn"}

    // 行き先に自分の駒
    const target = position.board.get(new Square(to.file, to.rank))
    if (target && target.owner === piece.owner) return { type: "invalidMove", reason: "own piece on destination"}

    // 駒の移動ルール
    const validMoves = generateValidMovesFrom(position, from)
    const isValid = validMoves.some(m => m.to.file == to.file && m.to.rank === to.rank && m.promote === promote);
    if (!isValid) {
        console.log("invalid move", from, to, piece)
        return {type: "invalidMove", reason: "illegal move"}
    }
    //if (!canMove(piece, from, to, position.board)) return null
    //let promote = piece.promoted       
    
    if (canPromote(from, to, piece)){
        return { type: "promotionPending", pendingPromotion: { from, to, pieceType: piece.type}}
    }
    //const promote = true // TODO
    const move = new Move(from, to, piece.type, false)
    console.log("resolve move intent", promote, move)     
    
    return { type: "move", move: move}
}

function resolveDropIntent(
    position: Position,
    pieceType: PieceType,
    to: Square
): IntentResult {
    
    // 空きマスチェック
    if (position.board.get(to)) return { type: "invalidMove", reason: "alread piece on drop destination"}

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