import { describe, expect, it } from "vitest";
import { Piece } from "../types/Piece";
import { Move } from "../types/Move";
import { Board } from "../types/Board";
import { BoardState } from "../types/BoardState";
import { Hand } from "../types/Hand";

describe("kif", ()=>{
    it("piece", ()=>{        
        const piece = new Piece("pawn", "black")
        const promoted = piece.promote()
        expect(promoted.promoted).toBeTruthy

    })

    it("move", () => {
        const piece = new Piece("pawn", "black")
        const move = new Move(null, { file:1, rank:1 }, "pawn", "black")

        
        const blackHand = Hand.empty().add(new Piece("pawn", "black"))
        const emptyBoard = Board.empty()
        let state = new BoardState(emptyBoard, {
            black: blackHand, white: Hand.empty()
        }, "black")
        state = move.apply(state)

        expect(state.board.get({file: 1, rank: 1})?.type).toEqual("pawn")


    })
})