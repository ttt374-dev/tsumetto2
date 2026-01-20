import { describe, expect, it } from "vitest";
import { Piece, Square } from "../types/Piece";
import { Move } from "../types/Move";
import { Board } from "../types/Board";
import { Position } from "../types/Position";
import { Hand, Hands } from "../types/Hand";

describe("kif", ()=>{
    const initialPosition = Position.create()
    initialPosition.board.dump()

    it("piece", ()=>{        
        const piece = new Piece("pawn", "black")
        const promoted = piece.promote()
        expect(promoted.promoted).toBeTruthy

    })

    it("move", () => {
        let state = initialPosition
        const move = new Move(Square.create(1, 3), Square.create(1, 4), 'pawn')
        state = move.apply(state)
        expect(state.board.get(1, 4)?.type).toEqual("pawn")
        expect(state.board.get(1, 4)).toBeNull
    })

    it("drop", () => {
        const blackHand = new Hand({pawn: 1})
        const hands = Hands.create(blackHand, Hand.empty())
        let state = new Position(Board.create(), hands)

        //const piece = new Piece("pawn")
        const move = new Move(null, Square.create(1, 1), "pawn")   
        expect(move.isDrop).toBeTruthy     
        state = move.apply(state)
        expect(state.board.get(1, 1)?.type).toEqual("pawn")
        expect(state.hands.get("black").count("pawn")).toEqual(0)

    })
    it("promote", () => {
        let state = initialPosition        
        const move = new Move(Square.create(1, 3),Square.create(1, 4), "pawn", true)
        state = move.apply(state)
        expect(state.board.get(1, 4)?.promoted).toBeTruthy       
    })
    it("capture", () => {
        let state = initialPosition
        const move = new Move(Square.create(8, 8), Square.create(1, 3), "bishop")
        expect(state.board.get(1, 3)?.owner).toEqual("white")
        state = move.apply(state)
        expect(state.hands.get("black").count('pawn')).toEqual(1)
        expect(state.board.get(1, 3)?.owner).toEqual("black")
        expect(state.board.get(1, 3)?.type).toEqual("bishop")
        
    })
})