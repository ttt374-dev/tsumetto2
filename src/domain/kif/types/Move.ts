import type { Piece, } from "./Piece";
import type { PlayerType } from "./PlayerType";
import type { Position } from "./Board";

export type Move = {
    type: "move";
    plyNumber: number;
    moveText: string;
    piece: Piece;
    player: PlayerType;
    to: Position;
    from?: Position

    drop: boolean;
}


export type GameStart = { type: "start" }
export type GameEnd = {
    type: "end",
    reason: GameEndReason,
    winner?: PlayerType,
    moveNumber?: number,
}
export type GameEndReason = "resign" | "timeup" | "illegal" | "draw"

export type KifEvent = Move | GameStart | GameEnd