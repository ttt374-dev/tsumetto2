import type { Result } from "@/application/result";
import { Board, Position, Hands, KifData, type Handicap, type KifHeader } from "../types"
import type { ParseError } from "./ParseError";
import { parseHand } from "./parseHand";
import { parseInitialBoard } from "./parseInitialPosition"
import { parseMoves } from "./parseMove"

type ParseKifResult = Result<KifData, ParseError>
  
export function parseKif(text: string): ParseKifResult {
    const lines = text.split(/\r?\n/)

    const headers: KifHeader = {}
    const initialPositionLines: string[] = []
    const moveLines: string[] = []

    let inMoves = false

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        //if (line.startsWith("手数----指手---------消費時間--")) {
        if (line.includes("指手") && line.includes("消費時間")) {
            inMoves = true
            continue
        }
        //if (!line.trim()) continue

        if (!inMoves) {
            const m = line.match(/^(.+?)：(.+)$/)
            if (m){
                headers[m[1]] = m[2]                
            } else {
                initialPositionLines.push(line)
            }
            
        } else {
            moveLines.push(line)
        }

    }
    if (!inMoves) return { ok: false, error: { domain: "move", detail: { "code": "missing-move-section"}}}

    //const handicap = headers["手合割"]     
    const resboard = parseInitialBoard(initialPositionLines)
    if (!resboard.ok) return { ok: false, error: { domain: "board", detail: resboard.error}}
    const board = resboard.value.kind === "board" ? resboard.value.board : Board.create()
    
    //console.log("後手の持ち駒", headers["後手の持駒"])
    const resBlack = parseHand(headers["先手の持駒"])
    const resWhite = parseHand(headers["後手の持駒"])
    if (!resBlack.ok) return { ok: false, error: { domain: "hand", detail: resBlack.error}}
    if (!resWhite.ok) return { ok: false, error: { domain: "hand", detail: resWhite.error}}

    const hands = Hands.create(resBlack.value, resWhite.value)
    
    const initialPosition = new Position(board, hands, "black")
    const resMoves = parseMoves(moveLines)
    if (!resMoves.ok) return { ok: false, error: resMoves.error.error }
    const kifData = new KifData(headers, initialPosition, resMoves.value)
    
    return { ok: true, value: kifData}
}

