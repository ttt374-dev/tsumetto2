import type { Position } from '../types'
import { zenkakuToNumber, kanToNumber } from './kanToNumber';
import type { ParseResult } from './parseResult';


////////////////////////////
export function parsePosition(moveStr: string, prevPosition?: Position): ParseResult<Position> {
  //console.log("parse position", moveStr)
  if (moveStr.length < 2) 
    return { ok: false, error: { message: "invalid position: ${moveString"}}
    //throw new ParseError(`invalid move: ${moveStr}`);

  if (moveStr.startsWith("同"))
    if (prevPosition)
      return { ok: true, value: prevPosition }
    else
      return { ok: false, error: {message: "no prev position given for DOU"}}

  const fileChar = moveStr[0];
  const rankChar = moveStr[1];

  const file = zenkakuToNumber(fileChar);
  const rank = kanToNumber[rankChar];

  //if (!file || !rank) throw new Error(`invalid move: ${moveStr}: ${file} ${rank}`);
  if (!file || !rank) return { ok: false, error: { message: `invalid move: ${moveStr}: ${file} ${rank}`}}
  //console.log("parsed: ", file, rank)
  return { ok: true, value: { file, rank }}
}

export function parseFromToPosition(from?: string | null): ParseResult<Position|null> {
  if (!from) return { ok: true, value: null};          // 空・undefined・null
  if (from.length !== 2) return {ok: true, value: null}

  const file = Number(from[0]);
  const rank = Number(from[1]);

  if (!Number.isInteger(file) || !Number.isInteger(rank)) {
    return { ok: false, error: { message: "invalid number"}}
    //return null;                   // 数字にできない
  }

  return { ok: true, value: { file, rank }};
}