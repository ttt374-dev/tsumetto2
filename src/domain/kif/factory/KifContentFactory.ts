import type { KifContent } from "../types";
import { createEmptyBoard } from "./BoardFactory";
import { createEmptyHands } from "./HandsFactory";


export function createKifContent(
  partial?: Partial<KifContent>
): KifContent {
  return {
    board: createEmptyBoard(),
    hands: createEmptyHands(),
    moves: [],
    headers: {},
    ...partial,
  };
}
