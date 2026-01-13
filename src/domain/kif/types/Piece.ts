import type { PlayerType } from "./PlayerType";
import  { PieceTypes } from "./PieceType";

export type Piece = {
  key: PieceTypeKey;
  owner: PlayerType;
};

export type HandPieceKey = "飛" | "角" | "金" | "銀" | "桂" | "香" | "歩";
export const HandPieceKeyOrder: HandPieceKey[] = [
  "飛", "角", "金", "銀", "桂", "香", "歩",
];

export type PieceTypeKey = keyof typeof PieceTypes;