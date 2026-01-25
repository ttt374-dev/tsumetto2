import { Position, kanjiToPieceItem, Move, type KifData, type KifHeader, type PieceType, type Player, type Square } from "../types"


export function parseMoves(
    lines: string[],
    initial: Position
): Move[] {
    let state = initial
    const moves: Move[] = []
    let prevSquare: Square | undefined = undefined

    //for (let i = 0; i < lines.length; i++) {
    for (const line of lines){
        const move = parseMoveLine(line, prevSquare)
        if (!move) continue  // TODO
        moves.push(move)
        //console.log("parse moves", move)
        prevSquare = move.to
        //state = state.applyMove(move)
    }

    return moves
}
export function parseMoveLine(line: string, prevSquare?: Square): Move | null {
    const trimmed = line.trim()

    // ① thinkingTime（行末）
    const timeMatch = trimmed.match(/\s+\(([^)]*)\)$/)
    //const thinkingTime = timeMatch?.[1]

    const withoutTime = timeMatch
        ? trimmed.slice(0, timeMatch.index).trim()
        : trimmed

    // ② plyIndex（先頭）
    const plyMatch = withoutTime.match(/^(\d+)\s+(.*)$/)
    if (!plyMatch) return null

    //const plyIndex = Number(plyMatch[1])
    const rawText = plyMatch[2]

    //console.log("pasre moveline", rawText)
    if (rawText.startsWith("投了")) return null
    if (rawText.includes("打")) {
        return parseDropMove(rawText, )
    } else {
        const move = parseNormalMove(rawText, prevSquare)        
        return move
    }
 
}


function parseDropMove(text: string): Move {
    // 例: "５五桂打"
    const m = text.match(/(.)(.)(.+?)打/)
    if (!m) throw new Error("Invalid move body")

    const file = kanjiToFile(m[1])
    const rank = kanjiToRank(m[2])
    const pieceItem = kanjiToPieceItem[m[3]]
    const { type, promoted } = pieceItem

    return new Move(null, { file, rank }, type, false, text)
}

function parseNormalMove(rawtext: string, prevSquare?: Square): Move {    
    
    // ７六歩(77)
    const mr = rawtext.match(/^(..)(.+)\((\d\d)\)$/)
    if (!mr) throw new Error("invalid body")
    const [_, toText, piecetypeText, fromText] = mr

    //console.log("parse normal move", toText, piecetypeText, fromText, rawtext)
    const to = parseTo(toText, prevSquare)
    //const pieceKey = parsePieceType(piecetypeText)
    const from = parseFrom(fromText)
    
    const { pieceType, promote} = parsePieceType(piecetypeText)
    //console.log("parsemove", rawtext, pieceType, promote, prevSquare)
    return new Move(
        from,
        to,
        pieceType,
        promote,
        rawtext
    )
}
function parseTo(text: string, prevSquare?: Square): Square {
    const m = text.match(/(.)(.)/)
    if (!m) throw new Error("")
    //const [ fileText, rankText] = m

    //if (fileText === "同"){
    if (text.startsWith("同")){
        if (!prevSquare) throw new Error("no prevoius squire given")       
        return prevSquare
    } else {    
        return {
        file: kanjiToFile(m[1]),
        rank: kanjiToRank(m[2])
        }
    }
}
function parsePieceType(text: string): {
    pieceType: PieceType, promote: boolean
} {
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
        throw new Error(`Unknown piece text: ${text}`)
    }
    const { type, promoted } = pieceItem
    
    return {
        pieceType: type,
        promote: promoteIntent || promoted
    }
}
function parseFrom(text: string): Square {
    const m = text.match(/(\d)(\d)/)
    if (!m) throw new Error("")
    const [ _, fileText, rankText ] = m
    return {
        file: Number(fileText),
        rank: Number(rankText),
    }
}
function kanjiToFile(k: string): number {
    return "１２３４５６７８９".indexOf(k) + 1
}

function kanjiToRank(k: string): number {
    return "一二三四五六七八九".indexOf(k) + 1
}

