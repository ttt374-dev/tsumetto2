import type { Position, PieceTypeKey, HandPieceKey,
    Board, Hands, Move
 } from '@/domain/kif/types'
import { PieceTypes } from '../types/PieceType';

function posToIndex(pos: Position) {
    return {
        x: pos.file - 1,
        y: pos.rank - 1,
    }
}

export function getBasePieceKey(
  key: PieceTypeKey
): PieceTypeKey {
  const pieceType = PieceTypes[key];
  return pieceType.promoted
    ? ( pieceType.base ?? "")
    : key;
}


export function applyMove(board: Board, hands: Hands, move: Move) {
    const { x, y } = posToIndex(move.to)
    
    //console.log("apply move")
    const cell = board[y][x]
    ///console.log("apply move", move, cell)
    // 相手の駒を取る
    if (cell !== null){
        const key = getBasePieceKey(cell.key) as HandPieceKey
        //console.log("相手の駒を取る", move, key)
        hands[move.player][key]++
    }

    // 移動
    board[y][x] = move.piece
    if (move.from !== undefined) {
        const { x: x2, y: y2 } = posToIndex(move.from)
        board[y2][x2] = null
    }
    // 打つの場合の持ち駒
    if (move.drop) {
        const ownerHands = hands[move.player];
        const key = move.piece.key as HandPieceKey;

        if (ownerHands[key] <= 0) {
            //throw new Error(`持ち駒がありません: ${key}`);
            console.error(`持ち駒がありません: ${key}`)
        }
        
        ownerHands[key] -= 1;
        //console.log("駒を打った", key, ownerHands[key])
    }
    
    
    //board[move.position.file][move.position.rank] = move.piece

}