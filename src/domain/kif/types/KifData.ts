import type { BoardState } from "./BoardState";
import type { Move } from "./Move";

export type KifHeader = Record<string, string>

export type KifData = {
  headers: KifHeader,
  initialState: BoardState,
  moves: Move[]
}

