import type { Hands, HandPieceKey, } from "../types";
import { PieceTypes } from "../types/PieceType";

export function createEmptyHand(): Record<HandPieceKey, number> {
  const hand = {} as Record<HandPieceKey, number>;

  for (const [key, def] of Object.entries(PieceTypes)) {
    if (!def.promoted) {
      hand[key as HandPieceKey] = 0;
    }
  }

  return hand;
}

export function createEmptyHands(): Hands {
  return {
    'black': createEmptyHand(),
    'white': createEmptyHand(),
  }
}