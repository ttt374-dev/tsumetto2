import type { Board } from "./Board";
import type { BoardState } from "./BoardState";
import type { Hands } from "./Hand";
import type { KifHistory, Move } from "./Move";

export type KifHeader = Record<string, string>

export type KifData = {
  headers: KifHeader,
  initialState: BoardState,
  moves: Move[]
}

/*
export type KifContent = {
  board: Board;
  hands: Hands;
  history: KifHistory,
  headers: KifHeader

}

*/