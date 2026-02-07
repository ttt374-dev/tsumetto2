import type { Result } from "@/application/result"
import { Position, kanjiToPieceItem, Move, type KifData, type KifHeader, type PieceType, type Player, type Square } from "../types"
import type { ParseError, ParseMoveLinesError } from "./ParseError"

type ParseMoveResult = 
    | { status: "parsed", value: Move}
    | { status: "skipped", reason: "empty-line" | "resign"}
    | { status: "error", error: ParseError }

type ParseMoveLinesResult = Result<Move[], ParseMoveLinesError>

export function parseMoves(lines: string[], initial: Position): ParseMoveLinesResult {
    let state = initial
    const moves: Move[] = []
    let prevSquare: Square | undefined = undefined

    for (let i = 0; i < lines.length; i++) {
    //for (const line of lines){
        const res = parseMoveLine(lines[i], prevSquare)
        switch (res.status){
            case "parsed":
                moves.push(res.value)
                prevSquare = res.value.to        
                break
            case "error":
                return { ok: false, error: { moveError: res.error, line: i+1, text: lines[i]}}
        }
    }

    return { ok: true, value: moves }
}
export function parseMoveLine(line: string, prevSquare?: Square): ParseMoveResult {
    const trimmed = line.trim()

    // ① thinkingTime（行末）
    const timeMatch = trimmed.match(/\s+\(([^)]*)\)$/)
    //const thinkingTime = timeMatch?.[1]

    const withoutTime = timeMatch
        ? trimmed.slice(0, timeMatch.index).trim()
        : trimmed

    // ② plyIndex（先頭）
    const plyMatch = withoutTime.match(/^(\d+)\s+(.*)$/)    
    if (!plyMatch) return { status: "error", error: { code: "invalid-move-body", cause: line}}

    //const plyIndex = Number(plyMatch[1])
    const rawText = plyMatch[2]

    //console.log("pasre moveline", rawText)
    if (rawText.startsWith("投了")) return { status: "skipped", reason: "resign"}
    if (rawText.includes("打")) {
        return parseDropMove(rawText, )
    } else {
        return parseNormalMove(rawText, prevSquare)        
        //return { status: "parsed", value: move}
    }
 
}

function parseDropMove(text: string): ParseMoveResult {
    // 例: "５五桂打"
    const m = text.match(/(.)(.)(.+?)打/)
    if (!m) return { status: "error", error: { code: "invalid-move-body", cause: text}}

    const file = kanjiToFile(m[1])
    const rank = kanjiToRank(m[2])
    const pieceItem = kanjiToPieceItem[m[3]]
    const { type, promoted } = pieceItem

    return { status: "parsed", value: new Move(null, { file, rank }, type, false, text)}
}

function parseNormalMove(rawtext: string, prevSquare?: Square): ParseMoveResult {    
    
    // ７六歩(77)
    const mr = rawtext.match(/^(..)(.+)\((\d\d)\)$/)
    if (!mr) throw new Error("invalid body")
    const [_, toText, piecetypeText, fromText] = mr

    //console.log("parse normal move", toText, piecetypeText, fromText, rawtext)
    const resTo = parseTo(toText, prevSquare)
    if (!resTo.ok) return { status: "error", error: resTo.error}
    //const pieceKey = parsePieceType(piecetypeText)
    const resFrom = parseFrom(fromText)
    if (!resFrom.ok) return { status: "error", error: resFrom.error}
    
    //const { pieceType, promote} = parsePieceType(piecetypeText)
    const resPiece = parsePieceType(piecetypeText)
    if (!resPiece.ok) return { status: "error", error: resPiece.error}
    //console.log("parsemove", rawtext, pieceType, promote, prevSquare)
    return { status: "parsed", value: new Move(
        resFrom.value,
        resTo.value,
        resPiece.value.pieceType,
        resPiece.value.promote,
        rawtext
    )}
}

type ParseSquareResult = Result<Square, ParseError>

function parseTo(text: string, prevSquare?: Square): ParseSquareResult {
    const m = text.match(/(.)(.)/)
    if (!m) return { ok: false, error: { code: "invalid-square", cause: text }}

    if (text.startsWith("同")){
        if (!prevSquare) return { ok: false, error: { code: "no-previous-square-given", cause: text}}
        return  { ok: true, value: prevSquare}
    }
    return {
        ok: true, value: {
            file: kanjiToFile(m[1]),
            rank: kanjiToRank(m[2])
        }
    }

}
type ParsePieceTypeResult = Result<{pieceType: PieceType, promote: boolean}, ParseError>

function parsePieceType(text: string): ParsePieceTypeResult {
    let t = text
    let promoteIntent: boolean = false
    if (t.endsWith("不成")){
        t = text.slice(0, -2)
    } else if (t.endsWith("成")){
        t = text.slice(0, 1)
        console.log("成", text)
        promoteIntent = true
    }
    if (["打", "右", "左", "引", "直", "寄", "上"].some(s => t.endsWith(s))) {
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
function kanjiToFile(k: string): number {
    return "１２３４５６７８９".indexOf(k) + 1
}

function kanjiToRank(k: string): number {
    return "一二三四五六七八九".indexOf(k) + 1
}

