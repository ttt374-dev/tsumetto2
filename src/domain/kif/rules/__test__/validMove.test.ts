import { describe, expect, it } from "vitest";
import { Piece, Square } from "../../entity/";
import { Move } from "../../entity/Move";
import { Board } from "../../entity/Board";
import { Position } from "../../entity/Position";
import { Hand, Hands } from "../../entity/Hand";
import { generateValidMovesFrom } from "../validMoveGenerator";

describe("valid-mode", ()=>{
    it("pawn", ()=>{
        const sq = Square.create(5, 7)
        const piece = Piece.create("pawn", "black")
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(Square.create(5, 7), Square.create(5, 6), "pawn", false)
        expect(moves).toContainEqual(expectedMove)
        
    })
    it("と金", ()=>{
        const sq = Square.create(5, 7)
        const piece = Piece.create("pawn", "black", true)
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(Square.create(5, 7), Square.create(4, 7), "pawn", false)
        expect(moves).toContainEqual(expectedMove)
        
    })

    it("桂馬", ()=>{
        const sq = Square.create(5, 7)
        const piece = Piece.create("knight", "black")
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(Square.create(5, 7), Square.create(4, 5), "knight", false)
        expect(moves).toContainEqual(expectedMove)        
    })
    
    it("成桂", ()=>{
        const sq = Square.create(5, 7)
        const piece = Piece.create("knight", "black", true)
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(Square.create(5, 7), Square.create(4, 7), "knight", false)
        expect(moves).toContainEqual(expectedMove)        
    })

    it("飛車", ()=>{
        const sq = Square.create(5, 7)
        const piece = Piece.create("knight", "black", true)
        const board = Board.empty().set(sq, piece)
        const position = new Position(board, Hands.empty(), "black")        

        const moves = generateValidMovesFrom(position, sq)
        const expectedMove = new Move(Square.create(5, 7), Square.create(4, 7), "knight", false)
        expect(moves).toContainEqual(expectedMove)        
    })
})


