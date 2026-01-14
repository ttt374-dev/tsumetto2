import { Board, BoardState, Hand, Move, type KifData,  } from "../types";


export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    headers: {},
    initialState: BoardState.empty(),    
    moves: [new Move({file: 1, rank:1}, {file:2, rank:2}, "bishop", "black")],
    ...partial,
  };
}
