import type { Board } from "./Board";
import type { Hands } from "./Board";
import type { Move } from "./Move";

export type KifHeader = Record<string, string>

export type KifContent = {
  board: Board;
  hands: Hands;
  //events: KifEvent[]
  moves: Move[];
  headers: KifHeader

}
