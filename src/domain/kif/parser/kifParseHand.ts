import type { Hand, Hands, HandPieceKey } from '../types';
import { kanToNumber, NumberToKanji } from './kanToNumber'
import { createEmptyHand } from '../factory/HandsFactory';

// 持ち駒
function parsePieceToken(token: string): {
  piece: HandPieceKey;
  count: number;
} | null {
  const match = token.match(/^(.)([一二三四五六七八九])?$/);
  if (!match) return null;

  const piece = match[1] as HandPieceKey;
  const count = match[2] ? kanToNumber[match[2]] : 1;

  return { piece, count };
}
export function parseHandString(
  text: string
): Record<HandPieceKey, number> {
  const hand = createEmptyHand(); // PieceTypes 由来の初期化

  if (!text.trim()) return hand;

  const tokens = text.trim().split(/\s+/);

  for (const token of tokens) {
    const parsed = parsePieceToken(token);
    if (!parsed) continue;

    hand[parsed.piece] += parsed.count;
  }
  //console.log("parsehand str", text, hand)
  return hand;
}
export function parseHands(lines: string[]): Hands{
  let hands: Hands = { black: createEmptyHand(), white: createEmptyHand() };  
    for (const line of lines) {    
    // 先手の持駒
    if (line.startsWith("先手の持駒：")) {
      
      const value = line.replace("先手の持駒：", "").trim();
      hands.black = parseHandString(value)
      continue;
    }

    // 後手の持駒
    if (line.startsWith("後手の持駒：")) {
      const value = line.replace("後手の持駒：", "").trim();
      hands.white = parseHandString(value)
      continue;
    }
  }
  return hands
}
/*
export function parseHandLine(
  line: string,
  hands: HandNew
) {
  // 全角コロン・半角コロン両対応
  const [label, body] = line.split(/[：:]/);
  if (!label || !body) return;

  let owner: PlayerType | null = null;

  if (label.includes("先手")) {
    owner = "black";
  } else if (label.includes("後手")) {
    owner = "white";
  }

  if (!owner) return;

  hands[owner] = parseHandString(body);
}
*/
// 
