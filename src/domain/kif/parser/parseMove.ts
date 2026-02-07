import type { Result } from "@/application/result"
import { Position, kanjiToPieceItem, Move, type KifData, type KifHeader, type PieceType, type Player, type Square } from "../types"
import type { ParseError, ParseErrorWithContext, ParseMoveError } from "./ParseError"
import { withContext } from "./ParseContext"

type SkipReason = "empty-line" | "comment-out" | "resign"

type ParseMoveOutcome =
  | { kind: "move"; move: Move }
  | { kind: "skip"; reason: SkipReason }

type ParseMoveResult = Result<ParseMoveOutcome, ParseMoveError>

export function parseMoves(lines: string[], initial: Position): Result<Move[], ParseErrorWithContext> {
    //let state = initial
    const moves: Move[] = []
    let prevSquare: Square | undefined = undefined

    for (let i = 0; i < lines.length; i++) {
    //for (const line of lines){
        const res = parseMoveLine(lines[i], prevSquare)
        if (!res.ok) return { ok: false, error: withContext(res.error, i+1, lines[i])}
        if (res.value.kind !== "move") continue        
        moves.push(res.value.move)
        prevSquare = res.value.move.to
    }

    return { ok: true, value: moves }
}
export function parseMoveLine(line: string, prevSquare?: Square): ParseMoveResult {
    const trimmed = line.trim()

    if (trimmed === "") {
        return { ok: true, value: { kind: "skip", reason: "empty-line" } }
    }
    if (trimmed.startsWith("*")) {
        return { ok: true, value: { kind: "skip", reason: "comment-out" } }
    }

    // ① thinkingTime（行末）
    const timeMatch = trimmed.match(/\s+\(([^)]*)\)$/)
    //const thinkingTime = timeMatch?.[1]

    const withoutTime = timeMatch
        ? trimmed.slice(0, timeMatch.index).trim()
        : trimmed

    // ② plyIndex（先頭）
    const plyMatch = withoutTime.match(/^(\d+)\s+(.*)$/)    
    if (!plyMatch) return { ok: false, error: { code: "invalid-move-body", cause: line}}

    //const plyIndex = Number(plyMatch[1])
    const rawText = plyMatch[2]

    //console.log("pasre moveline", rawText)
    if (rawText.startsWith("投了")) return { ok: true, value: { kind: "skip", reason: "resign"}}
    if (rawText.includes("打")) {
        return parseDropMove(rawText, )
    } else {
        return parseNormalMove(rawText, prevSquare)        
        //return { status: "parsed", value: move}
    }
 
}

function parseDropMove(text: string): ParseMoveResult {
    // 例: "５五桂打"
    //const m = text.match(/(.)(.)(.+?)打/)
    const m = text.match(/^(.)(.)([^打]+)打$/)
    if (!m) return { ok: false, error: { code: "invalid-move-body", cause: text}}

    const resfile = kanjiToFile(m[1])
    const resrank = kanjiToRank(m[2])
    const pieceItem = kanjiToPieceItem[m[3]]
    if (!pieceItem) {
        return { ok: false, error: { code: "unknown-piece-kanji", cause: m[3] } }
    }
    const { type, promoted } = pieceItem

    if (!resfile.ok) return { ok: false, error: resfile.error}
    if (!resrank.ok) return { ok: false, error: resrank.error}
    const to = { file: resfile.value, rank: resrank.value }
    return { ok: true, value: { kind: "move", move: new Move(null, to, type, false, text)}}
}

function parseNormalMove(rawtext: string, prevSquare?: Square): ParseMoveResult {        
    // ７六歩(77)
    const mr = rawtext.match(/^(..)(.+)\((\d\d)\)$/)
    if (!mr) return { ok: false, error: { code: "invalid-move-body", cause: rawtext}}
    const [_, toText, piecetypeText, fromText] = mr

    //console.log("parse normal move", toText, piecetypeText, fromText, rawtext)
    const resTo = parseTo(toText, prevSquare)
    if (!resTo.ok) return { ok: false, error: resTo.error}
    //const pieceKey = parsePieceType(piecetypeText)
    const resFrom = parseFrom(fromText)
    if (!resFrom.ok) return { ok: false, error: resFrom.error}
    
    //const { pieceType, promote} = parsePieceType(piecetypeText)
    const resPiece = parsePieceType(piecetypeText)
    if (!resPiece.ok) return { ok: false, error: resPiece.error}
    //console.log("parsemove", rawtext, pieceType, promote, prevSquare)
    return { ok: true, value: { kind: "move", move: new Move(
        resFrom.value,
        resTo.value,
        resPiece.value.pieceType,
        resPiece.value.promote,
        rawtext
    )}}
}

type ParseSquareResult = Result<Square, ParseMoveError>

function parseTo(text: string, prevSquare?: Square): ParseSquareResult {
    const m = text.match(/(.)(.)/)
    if (!m) return { ok: false, error: { code: "invalid-square", cause: text }}

    if (text.startsWith("同")){
        if (!prevSquare) return { ok: false, error: { code: "no-previous-square-given", cause: text}}
        return  { ok: true, value: prevSquare}
    }
    const resfile = kanjiToFile(m[1])
    const resrank = kanjiToRank(m[2])
    
    if (!resfile.ok) return { ok: false, error: resfile.error}
    if (!resrank.ok) return { ok: false, error: resrank.error}
    return {
        ok: true, value: {file: resfile.value, rank: resrank.value }
    }

}
type ParsePieceTypeResult = Result<{pieceType: PieceType, promote: boolean}, ParseMoveError>

function parsePieceType(text: string): ParsePieceTypeResult {
    let t = text
    let promoteIntent: boolean = false
    if (t.endsWith("不成")){
        t = text.slice(0, -2)
    } else if (t.endsWith("成")){
        t = text.slice(0, 1)
        //console.log("成", text)
        promoteIntent = true
    }
    while (["打", "右", "左", "引", "直", "寄", "上"].some(s => t.endsWith(s))) {
        t = t.slice(0, -1)
    }
    const pieceItem = kanjiToPieceItem[t] // misdisambiguish の処理
    
    if (!pieceItem) {
        return { ok: false, error: { code: "unknown-piece-kanji", cause: text}}
    }
    const { type, promoted } = pieceItem
    
    return { ok: true, value: {
        pieceType: type,
        promote: promoteIntent || promoted
    }}
}
function parseFrom(text: string): ParseSquareResult {
    const m = text.match(/(\d)(\d)/)
    if (!m) return { ok: false, error: { code: "invalid-square", cause: text}}
    const [ _, fileText, rankText ] = m
    return { ok: true, value: {
        file: Number(fileText),
        rank: Number(rankText),
    }}
}
function kanjiToFile(k: string): Result<number, ParseMoveError> {
    //return "１２３４５６７８９".indexOf(k) + 1
    const i = "１２３４５６７８９".indexOf(k)
    if (i === -1) return { ok: false, error: { code: "invalid-number-kanji", cause: k } }
    return { ok: true, value: i + 1 }
}

function kanjiToRank(k: string): Result<number, ParseMoveError> {
    const i = "一二三四五六七八九".indexOf(k)
    if (i === -1) return { ok: false, error: { code: "invalid-number-kanji", cause: k } }
    return { ok: true, value: i + 1 }
}

