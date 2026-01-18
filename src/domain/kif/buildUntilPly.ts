import type { KifHistory } from "./types";
import type { Position } from "./types/Position";

export function buildUntilPly(history: KifHistory, ply: number): Position {
  return history.moves
    .slice(0, ply)
    .reduce((state, move) => move.apply(state), history.initial)
}


