import type { KifHistory, Position } from "../entity";


export function buildUntilPly(history: KifHistory, ply: number): Position {
  console.log("build ply", ply, history)
  return history.moves
    .slice(0, ply)
    .reduce((state, move) => move.apply(state), history.initial)
}


