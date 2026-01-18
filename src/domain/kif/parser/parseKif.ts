import { Board, Position, Hands, KifData, type Handicap, type KifHeader } from "../types"
import { parseHand } from "./parseHand";
import { parseInitialBoard } from "./parseInitialPosition"
import { parseMoves } from "./parseMove"

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

  
export function parseKif(text: string): ParseResult<KifData> {
    const lines = text.split(/\r?\n/)

    const headers: KifHeader = {}
    const initialPositionLines: string[] = []
    const moveLines: string[] = []

    let inMoves = false

    for (const line of lines) {
        if (line.startsWith("手数----指手---------消費時間--")) {
            inMoves = true
            continue
        }
        if (!line.trim()) continue

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
    if (!inMoves) return { ok: false, message: "invalid format: no valid splitter"}


    //const handicap = headers["手合割"]     
    const board = parseInitialBoard(initialPositionLines) ?? Board.create()            
    
    
    //console.log("後手の持ち駒", headers["後手の持駒"])
    const hands = Hands.create(
        parseHand(headers["先手の持駒"]),
        parseHand(headers["後手の持駒"]),
    )
    const initialPosition = new Position(board, hands, "black")
    const moves = parseMoves(moveLines, initialPosition)
    const kifData = new KifData(headers, initialPosition, moves)
    
    return { ok: true, value: kifData}
}

