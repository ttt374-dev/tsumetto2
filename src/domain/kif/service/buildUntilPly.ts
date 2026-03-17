import type { KifHistory, Move, Position } from "../entity";


export function buildUntilPly(initialPosition: Position, moves: Move[], ply: number): Position {
    //console.log("build ply", ply, history)
    return moves
        .slice(0, ply)
        .reduce((state, move) => move.apply(state), initialPosition)
}



/*
export function ___buildUntilPly(history: KifHistory, ply: number): Position {
  console.log("build ply", ply, history)
  return history.moves
    .slice(0, ply)
    .reduce((state, move) => move.apply(state), history.initial)
}


*/