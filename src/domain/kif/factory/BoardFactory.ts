import type { Board, PlayerType, PieceTypeKey, Piece } from '../types'

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );
}
export function createDefaultBoard(): Board {
  const board = createEmptyBoard();

  // 先手（black）
  placeBackRank(board, "black", 9);
  placeRookBishop(board, "black", 8);
  placePawns(board, "black", 7);

  // 後手（white）
  placeBackRank(board, "white", 1);
  placeRookBishop(board, "white", 2);
  placePawns(board, "white", 3);

  return board;
}
const BACK_RANK: PieceTypeKey[] = [
  "香", "桂", "銀", "金", "玉", "金", "銀", "桂", "香",
];
function piece(key: PieceTypeKey, owner: PlayerType): Piece {
  return { key, owner };
}
function placeBackRank(
  board: Board,
  owner: PlayerType,
  rank: number
) {
  BACK_RANK.forEach((key, file) => {
    board[rank - 1][file] = piece(key, owner);
  });
}
function placeRookBishop(
  board: Board,
  owner: PlayerType,
  rank: number
) {
  if (owner === "black") {
    board[rank - 1][1] = piece("飛", owner);
    board[rank - 1][7] = piece("角", owner);
  } else {
    board[rank - 1][7] = piece("飛", owner);
    board[rank - 1][1] = piece("角", owner);
  }
}

function placePawns(
  board: Board,
  owner: PlayerType,
  rank: number
) {
  for (let file = 0; file < 9; file++) {
    board[rank - 1][file] = piece("歩", owner);
  }
}
