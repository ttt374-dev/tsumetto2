import { Board, BoardState, Hand, Hands, kanjiToPieceItem, Piece, type PieceType } from "../types";

export function parseInitialBoard(lines: string[]): Board | null {
     const boardLines = extractBoardBodyLines(lines);
  //console.log("parse board", boardLines)

  if (!boardLines) {
    //return createDefaultBoard();
    return null
  }

  return createBoardStateFromKif(boardLines);
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


//////////////////////////////////

export function createBoardStateFromKif(boardLines: string[]): Board {
  let board = Board.empty()

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

      const file = 9 - i;
      const rank = r + 1;

      const pieceItem = kanjiToPieceItem[name]
      const { type, promoted } = pieceItem
      
      const piece = new Piece(type as PieceType, isWhite ? 'white' : 'black', promoted)
      board = board.set({rank: rank, file: file}, piece)
      console.log("parse board", file, rank, piece.type, piece.promoted, piece.owner)


      /*
      board[rank][file] = {
        key: name as PieceTypeKey,
        owner: isWhite ? "white" : "black",
      };
      */
    }
  }
  //const hands = Hands.empty()  // TODO
  
  //console.log("createfrom kif")
  //board.dump()
  return board
}


















