import type { Piece } from "./Piece";
import type { HandPieceKey } from "./Piece";

export type Position = {
  file: number;
  rank: number;
}

export type Board = (Piece | null)[][];

export type Hands = {
  black: Hand; // "金二 銀" のような文字列
  white: Hand;
};

export type Hand = Record<HandPieceKey, number>
