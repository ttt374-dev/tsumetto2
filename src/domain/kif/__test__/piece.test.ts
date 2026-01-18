import { describe, expect, it } from "vitest";
import { Piece } from "../types/Piece";
import { Move } from "../types/Move";
import { Board } from "../types/Board";
import { Position } from "../types/Position";
import { Hand, Hands } from "../types/Hand";

describe("kif", ()=>{
    const initialPosition = Position.create()

    it("piece", ()=>{        
        const piece = new Piece("pawn", "black")
        const promoted = piece.promote()
        expect(promoted.promoted).toBeTruthy

    })

    it("move", () => {
        let state = initialPosition
        const move = new Move({ file:1, rank:3}, {file:1, rank: 4}, 'pawn')
        state = move.apply(state)
        expect(state.board.get({file:1, rank: 4})?.type).toEqual("pawn")
        expect(state.board.get({file:1, rank: 4})).toBeNull
    })

    it("drop", () => {
        const blackHand = new Hand({pawn: 1})
        const hands = Hands.create(blackHand, Hand.empty())
        let state = new Position(Board.create(), hands)

        //const piece = new Piece("pawn")
        const move = new Move(null, { file:1, rank:1 }, "pawn")   
        expect(move.isDrop).toBeTruthy     
        state = move.apply(state)
        expect(state.board.get({file: 1, rank: 1})?.type).toEqual("pawn")
        expect(state.hands.get("black").count("pawn")).toEqual(0)

    })
    it("promote", () => {
        let state = initialPosition
        const move = new Move({file:1, rank:3}, { file:1, rank: 4}, "pawn", true)
        state = move.apply(state)
        expect(state.board.get({file: 1, rank: 4})?.promoted).toBeTruthy       
    })
    it("相手の駒を取る", () => {
        let state = initialPosition
        const move = new Move({file:1, rank:3}, { file:1, rank: 7}, "pawn", true)
        state = move.apply(state)
        expect(state.hands.get("black").count('pawn')).toEqual(1)
    })
})