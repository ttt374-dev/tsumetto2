import { BoardState, Move, type KifData, type PieceType, type Player } from "../types"


export function parseKif(text: string): KifData {
  const lines = text.split(/\r?\n/)

  const headers: Record<string, string> = {}
  const moveLines: string[] = []

  let inMoves = false

  for (const line of lines) {
    if (line.startsWith("手数")) {
      inMoves = true
      continue
    }

    if (!inMoves) {
      const m = line.match(/^(.+?)：(.+)$/)
      if (m) headers[m[1]] = m[2]
    } else {
      if (line.trim()) moveLines.push(line)
    }
  }

  const initialState = parseInitialState(headers)
  const moves = parseMoves(moveLines, initialState)

  return { headers, initialState, moves }
}

function parseInitialState(header: Record<string, string>): BoardState {
  // 今は「平手」前提
  // 将来：駒落ち・盤面図対応
  return BoardState.empty()
}

function parseMoves(
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
  const pieceType = parsePieceType(m[3])
  const promote = !!m[4]
  

  return new Move(null, { file, rank }, pieceType, player, promote)
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
  const pieceType = parsePieceType(m[3])
  const promote = !!m[4]
  const from = {
    file: Number(m[5]),
    rank: Number(m[6]),
  }

  return new Move(from, { file, rank }, pieceType, player, promote)
}
function kanjiToFile(k: string): number {
  return "１２３４５６７８９".indexOf(k) + 1
}

function kanjiToRank(k: string): number {
  return "一二三四五六七八九".indexOf(k) + 1
}

function parsePieceType(s: string): PieceType {
  switch (s) {
    case "歩": return "pawn"
    case "香": return "lance"
    case "桂": return "knight"
    case "銀": return "silver"
    case "金": return "gold"
    case "角": return "bishop"
    case "飛": return "rook"
    case "玉":
    case "王": return "king"
    default:
      throw new Error(`Unknown piece: ${s}`)
  }
}
