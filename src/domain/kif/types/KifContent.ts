import type { Board } from "./Board";
import type { Hands } from "./Board";
import type { KifEvent } from "./Move";

export type KifHeader = Record<string, string>

export type KifContent = {
  board: Board;
  hands: Hands;
  events: KifEvent[]
  headers: KifHeader

}
