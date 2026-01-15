import { BoardState, kanjiToPieceItem, Move, type KifData, type KifHeader, type PieceType, type Player } from "../types"


export function parseMoves(
    lines: string[],
    initial: BoardState
): Move[] {
    let state = initial
    const moves: Move[] = []

    for (let i = 0; i < lines.length; i++) {
        const move = parseMoveLine(lines[i], i + 1, state)
        moves.push(move)
        state = state.applyMove(move)
    }

    return moves
}

export function parseMoveLine(
    line: string,
    ply: number,
    state: BoardState
): Move {
    // 例: "1 ７六歩(77)"
    const m = line.match(/\d+\s+(.+)/)
    if (!m) throw new Error("Invalid move line")

    const body = m[1]

    const player =
        ply % 2 === 1 ? "black" : "white"

    return parseMoveBody(body, player, state)
}
export function parseMoveBody(
    body: string,
    player: Player,
    state: BoardState
): Move {

    // 打ち駒
    if (body.includes("打")) {
        return parseDropMove(body, player, state)
    }

    // 通常の移動
    return parseNormalMove(body, player, state)
}
function parseDropMove(
    text: string,
    player: Player,
    _state: BoardState
): Move {
    // 例: "５五桂打"
    const m = text.match(/(.)(.)(.+?)打/)
    if (!m) throw new Error("Invalid move body")

    const file = kanjiToFile(m[1])
    const rank = kanjiToRank(m[2])
    const pieceItem = kanjiToPieceItem[m[3]]
    const { type, promoted } = pieceItem

    return new Move(null, { file, rank }, type, player, promoted)
}

function parseNormalMove(
    text: string,
    player: Player,
    state: BoardState
): Move {
    // ７六歩(77)
    const m = text.match(/(.)(.)(.+?)(成)?\((\d)(\d)\)/)
    if (!m) throw new Error("Invalid move body")

    const file = kanjiToFile(m[1])
    const rank = kanjiToRank(m[2])
    //const pieceType = parsePieceType(m[3])
    const pieceItem = kanjiToPieceItem[m[3]]
    const { type, promoted } = pieceItem

    //const promote = !!m[4]
    const from = {
        file: Number(m[5]),
        rank: Number(m[6]),
    }

    return new Move(from, { file, rank }, type, player, promoted)
}
function kanjiToFile(k: string): number {
    return "１２３４５６７８９".indexOf(k) + 1
}

function kanjiToRank(k: string): number {
    return "一二三四五六七八九".indexOf(k) + 1
}

