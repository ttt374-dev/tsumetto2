import type { Result } from "@/shared/result";
import { Board, KanjiToPieceItem, Piece, Square, type PieceType } from "../../entity";
import type { ParseInitialBoardError } from "./ParseError";

type InitialBoardOutcome =
    | { kind: "board"; board: Board }
    | { kind: "empty" }

type ParseInitialBoardResult = Result<InitialBoardOutcome, ParseInitialBoardError>

export function parseInitialBoard(lines: string[]): ParseInitialBoardResult {
    const resboardLines = extractBoardBodyLines(lines);
    if (!resboardLines.ok) return { ok: false, error: resboardLines.error }
    //console.log("parse board", boardLines)

    if (resboardLines.value === null) return { ok: true, value: { kind: "empty" } }
    const resboard = createBoardStateFromKif(resboardLines.value)
    if (!resboard.ok) return { ok: false, error: resboard.error }
    return { ok: true, value: { kind: "board", board: resboard.value } }
}

function extractBoardBodyLines(lines: string[]): Result<string[] | null, ParseInitialBoardError> {
    const start = lines.findIndex(l =>
        l.includes("+---------------------------+")
    );

    if (start === -1) return { ok: true, value: null };

    const end = lines.findIndex(
        (l, i) =>
            i > start && l.includes("+---------------------------+")
    );

    if (end === -1) return { ok: false, error: { code: "board-not-closed" } };

    // 区切り線を除外して中身だけ（9行）を返す
    const body = lines.slice(start + 1, end);

    // 念のため行数チェック（通常は 9）
    if (body.length !== 9) return { ok: false, error: { code: "invalid-board-line-count", actual: body.length } };
    return { ok: true, value: body };
}

//////////////////////////////////

function isEmptyCell(cell: string): boolean {
    const trimmed = cell.trim();
    return !trimmed || trimmed === "・"
}

export function createBoardStateFromKif(boardLines: string[]): Result<Board, ParseInitialBoardError> {
    let board = Board.empty()

    for (let r = 0; r < 9; r++) {
        const line = boardLines[r];
        if (!line) return { ok: false, error: { code: "invalid-board-row", row: r + 1 } }

        // "| ◯◯◯… |一" の中央部
        const inside = line.split("|")[1] ?? "";
        const rowStr = inside;

        for (let i = 0; i < 9; i++) {
            const cell = rowStr.substring(i * 2, i * 2 + 2);
            if (isEmptyCell(cell)) continue;
            const trimmed = cell.trim();
            const isWhite = trimmed.startsWith("v");
            const name = isWhite ? trimmed.substring(1) : trimmed;

            const file = 9 - i;
            const rank = r + 1;

            const pieceItem = KanjiToPieceItem[name]
            if (!pieceItem) return { ok: false, error: { code: "unknown-piece", cause: name } }
            const { type, promoted } = pieceItem

            const piece = Piece.create(type as PieceType, isWhite ? 'white' : 'black', promoted)
            board = board.set(Square.create(file, rank), piece)
            //console.log("parse board", file, rank, piece.type, piece.promoted, piece.owner)

        }
    }

    //board.dump()
    return { ok: true, value: board }
}
