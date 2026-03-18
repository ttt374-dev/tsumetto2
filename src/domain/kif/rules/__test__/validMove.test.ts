import { describe, expect, it } from "vitest";
import { Piece, Square } from "../../entity/Piece";
import { Move } from "../../entity/Move";
import { Board } from "../../entity/Board";
import { Position } from "../../entity/Position";
import { Hand, Hands } from "../../entity/Hand";
import { generateValidMovesFrom } from "../validMoveGenerator";

describe("valid-mode", ()=>{
    it("pawn", ()=>{
        //const position = Position.create()

        const sq = new Square(5, 7)
        const piece = new Piece("pawn", "black")
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(new Square(5, 7), new Square(5, 6), "pawn", false)
        expect(moves).toContainEqual(expectedMove)
        
    })
    it("と金", ()=>{
        //const position = Position.create()

        const sq = new Square(5, 7)
        const piece = new Piece("pawn", "black", true)
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(new Square(5, 7), new Square(4, 7), "pawn", false)
        expect(moves).toContainEqual(expectedMove)
        
    })

    it("桂馬", ()=>{
        //const position = Position.create()

        const sq = new Square(5, 7)
        const piece = new Piece("knight", "black")
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(new Square(5, 7), new Square(4, 5), "knight", false)
        expect(moves).toContainEqual(expectedMove)        
    })
    
    it("成桂", ()=>{
        //const position = Position.create()

        const sq = new Square(5, 7)
        const piece = new Piece("knight", "black", true)
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(new Square(5, 7), new Square(4, 7), "knight", false)
        expect(moves).toContainEqual(expectedMove)        
    })
})


