import type { Hand, HandPieceKey } from '../types'
import { NumberToKanji } from '../parser/kanToNumber';
import { HandPieceKeyOrder } from '../types';


export function formatHand(hand: Hand): string {
  const parts: string[] = [];

  HandPieceKeyOrder.forEach(piece => {
    const count = hand[piece];
    if (count > 0) {
      const suffix = NumberToKanji[count] ?? count.toString();
      parts.push(`${piece}${suffix}`);
    }
  });

  return parts.length === 0 ? "なし" : parts.join(" ");
}
