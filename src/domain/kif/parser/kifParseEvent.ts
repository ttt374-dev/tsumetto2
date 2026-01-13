import type { KifEvent, Position, Piece, PlayerType, PieceTypeKey, GameStart } from "../types";
import type { ParseResult } from "./parseResult";
import { parsePosition, parseFromToPosition } from './kifParsePosition';

export function parseEvents(lines: string[]): KifEvent[]{ // ParseResult<KifEvent[]>{
    //const gameStart: GameStart = { type: "start"}
    const events: KifEvent[] = [];
    let inEvents = false
    let prevTo = undefined

    for (const line of lines){
        if (line.startsWith("手数")){
            inEvents = true;
            continue;
        }
        if (!inEvents) continue;

        const eventResult = parseEventLine(line, prevTo)
        //if (eventResult.ok === false) return eventResult
        if (eventResult.ok){
            const event = eventResult.value
            events.push(event)
            

            if (event.type === "end") {  // TODO
                break
            } else if (event.type === "move") {
                prevTo = event.to
            }
        }
        
    }

    return events
    //return { ok: true, value: events }
}

export function parseEventLine(line: string, prevPosition?: Position): ParseResult<KifEvent>{
    //console.log("parse event line", line)
    /// move
    //  例: "  5 １六歩(43)    ( 0:00/00:00:00)"
    
    const moveRegex = /^\s*(\d+)\s+([^\(]+?)(?:\((\d\d)\))?\s*\(/;
    const m = line.match(moveRegex);
    
    if (!m) return { ok: false, error: { message: `no match regex for Move: ${line}`}}
    const [_, numberText, moveText, fromText]  = m
    const plyNumber = parseInt(numberText, 10)
    const player = plyNumber % 2 == 1 ? 'black' : 'white'

    // GameEnd event
    if (moveText.startsWith("投了")){
        return { ok: true, value: { type: "end", reason: "resign",  winner: player}}
    }
    
    // Move event
    const moveTextResult = parseMoveText(moveText, player, prevPosition)    
    if (!moveTextResult.ok) return { ok: false, error: { message: `movetext parse error: ${moveText}`}}
    const fromResult = parseFromToPosition(fromText)
    if (!fromResult.ok) return { ok: false, error: { message: `from result parse error; ${fromText}`}}
    const { position: to, piece, drop } = moveTextResult.value
    const from = fromResult.value ?? undefined
    return { ok: true, value: { type: "move", plyNumber, player, piece, moveText, to, from, drop}}
    
}   

function parseMoveText(moveText: string, player: PlayerType, prevPosition?: Position): ParseResult<{position: Position, piece: Piece, drop: boolean}> {
    const positionResult = parsePosition(moveText, prevPosition)
    if (!positionResult.ok) return { ok: false, error: { message: `position parse error: ${moveText}`}}
    const pieceResult = parsePiece(moveText, player)
    if (!pieceResult.ok) return { ok: false, error: { message: `piece parse error: ${moveText}`}}
    const drop = moveText.endsWith("打")
    return { ok: true, value: { 
        //...pieceResult.value,   // drop, piece        
        position: positionResult.value,        
        piece: pieceResult.value,
        drop: drop
    }}

}

function parsePiece(moveText: string, player: PlayerType){
    let drop = false
    let baseMoveText = moveText
    if (moveText.endsWith("不成")) {
        baseMoveText = moveText.slice(0, -2)
    }
    if (["打", "右", "左", "引", "直", "寄", "上"].some(s => baseMoveText.endsWith(s))) {
        baseMoveText = baseMoveText.slice(0, -1)
    }
    const piece: Piece = {
        key: baseMoveText.slice(2) as PieceTypeKey, // TODO validate
        owner: player
    }
    return { 
        ok: true,
        value: piece,
    }
}