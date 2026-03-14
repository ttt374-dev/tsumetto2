import { Move, type PieceType, type Position, type Square } from "@/domain/kif/entity";
import { canPromote, isSameMove } from "@/domain/kif/rules";

export type MoveResult =
  | { type: "incorrect" }
  | { type: "playerMove" }
  | { type: "solved" }
  | { type: "playerAndOpponent" }

export function resolveMove(moves: Move[], ply: number, move: Move): MoveResult {
    if (!isSameMove(moves[ply], move)) {
        return { type: "incorrect" }
    }
    const nextPly = ply + 1

    if (nextPly >= moves.length) {
        return { type: "solved" }
    }

    return { type: "playerAndOpponent" }
}

//////////
export type Intent =    // ユーザのアクション
    | { type: "move"; from: Square; to: Square }
    | { type: "drop"; pieceType: PieceType; to: Square }
    | { type: "choosePromotion"; promote: boolean}

export type IntentResult =   // ゲームエンジンの状態
    | { type: "move", move: Move}
    | { type: "promotionPending", move: Move}

export function resolveIntent(
    position: Position,
    intent: Intent
): IntentResult | null {
    if (intent.type === "move") {
        return resolveBoardMove(position, intent.from, intent.to)
    }

    if (intent.type === "drop") {
        return resolveDrop(position, intent.pieceType, intent.to)
    }
    return null}

function resolveBoardMove(
    position: Position,
    from: Square,
    to: Square
): IntentResult | null {
    const piece = position.board.get(from.file, from.rank)
    if (!piece) return null

    // 手番チェック
    if (piece.owner !== position.sideToMove) return null

    // 行き先に自分の駒
    const target = position.board.get(to.file, to.rank)
    if (target && target.owner === piece.owner) return null

    // 駒の移動ルール
    //if (!canMove(piece, from, to, position.board)) return null

    let promote = piece.promoted
    const move = new Move(from, to, piece.type, promote)    
    console.log("resolve board mvoe", move, promote)
    if (canPromote(from, to, piece)){
        //promote = (window.confirm("成りますか？"))
        console.log("promote pending", move)
        return { type: "promotionPending", move}
    }
    //const promote = true // TODO
    return { type: "move", move: move}
}

function resolveDrop(
    position: Position,
    pieceType: PieceType,
    to: Square
): IntentResult | null {

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

    const move = new Move(null, to, pieceType)    
    return { type: "move", move: move}
}