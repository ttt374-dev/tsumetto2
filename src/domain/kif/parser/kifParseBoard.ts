import type { Board, PieceTypeKey } from "../types";
import { createEmptyBoard, createDefaultBoard } from "../factory/";

export function parseBoard(lines: string[]): Board | null{
  const boardLines = extractBoardBodyLines(lines);
  //console.log("parse board", boardLines)

  if (!boardLines) {
    //return createDefaultBoard();
    return null
  }

  return createBoardFromKif(boardLines);
}

function extractBoardBodyLines(lines: string[]): string[] | null {
  const start = lines.findIndex(l =>
    l.includes("+---------------------------+")
  );

  if (start === -1) return null;

  const end = lines.findIndex(
    (l, i) =>
      i > start && l.includes("+---------------------------+")
  );

  if (end === -1) return null;

  // 区切り線を除外して中身だけ（9行）を返す
  const body = lines.slice(start + 1, end);

  // 念のため行数チェック（通常は 9）
  if (body.length < 9) return null;
  return body;
}

export function createBoardFromKif(boardLines: string[]): Board {
  const board = createEmptyBoard();

  for (let r = 0; r < 9; r++) {
    const line = boardLines[r];
    if (!line) continue;

    // "| ◯◯◯… |一" の中央部
    const inside = line.split("|")[1] ?? "";
    const rowStr = inside;

    for (let i = 0; i < 9; i++) {
      const cell = rowStr.substring(i * 2, i * 2 + 2);
      const trimmed = cell.trim();

      if (!trimmed || trimmed === "・") continue;

      const isWhite = trimmed.startsWith("v");
      const name = isWhite ? trimmed.substring(1) : trimmed;

      const file = 8 - i;
      const rank = r;

      board[rank][file] = {
        key: name as PieceTypeKey,
        owner: isWhite ? "white" : "black",
      };
    }
  }

  return board;
}























export function parseBoardOld(lines: string[]): Board {
  const board: Board = createEmptyBoard()
  // 盤面開始位置
  const startIndex = lines.findIndex((l) =>
    l.includes("+---------------------------+")
  );
    
  for (let r = 0; r < 9; r++) {
    const line = lines[startIndex + 1 + r];
    if (!line) continue;
    
    // "| ◯◯◯… |一" の中央部を取り出す
    const inside = line.split("|")[1] ?? "";
    const rowStr = inside; // 例: " ・ ・ ・ 龍 ・ ・v銀v桂v香"

    // 1 セルは 2 文字で固定
    // rowStr は 18 文字以上あるので 0,2,4,...16 を取り出す
    for (let i = 0; i < 9; i++) {
      const cell = rowStr.substring(i * 2, i * 2 + 2); // 2文字

      let trimmed = cell.trim(); // "・", "金", "v銀" など

      if (!trimmed || trimmed === "・") {
        // 空マス
        continue;
      }

      // 後手駒（先頭が v）
      const isGote = trimmed.startsWith("v");
      const name = isGote ? trimmed.substring(1) : trimmed;

      // file は 9→1 を 0→8 に合わせて変換
      const file = 8 - i;
      const rank = r; // r=0 → 一段目

      //console.log("parsed:", file, rank, name, isGote ? "gote" : "sente")
      board[rank][file] = {
        key: name as PieceTypeKey,
        //isBlack: !isGote,        
        owner: isGote ? 'black' : 'white'
      };
    }
  }
  return board
}
