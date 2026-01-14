import type { KifHistory } from "./types";
import type { BoardState } from "./types/BoardState";

export function buildUntilPly(history: KifHistory, ply: number): BoardState {
  return history.moves
    .slice(0, ply)
    .reduce((state, move) => move.apply(state), history.initial)
}


