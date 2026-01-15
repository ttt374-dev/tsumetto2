import { Board, BoardState, Hands, type Handicap, type KifData, type KifHeader } from "../types"
import { parseInitialState } from "./parseInitialState"
import { parseMoves } from "./parseMove"

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

  
export function parseKif(text: string): ParseResult<KifData> {
    const lines = text.split(/\r?\n/)

    const headers: KifHeader = {}
    const initialStateLines: string[] = []
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
                initialStateLines.push(line)
            }
            
        } else {
            moveLines.push(line)
        }

    }
    if (!inMoves) return { ok: false, message: "invalid format: no valid splitter"}


    //const handicap = headers["手合割"]     
    const initialState = parseInitialState(initialStateLines) ?? 
        new BoardState(Board.create(), Hands.empty())
    //console.log("parse kif")
    //initialState.board.dump()
    const moves = parseMoves(moveLines, initialState)
    
    return { ok: true, value: { headers, initialState, moves }}
}

