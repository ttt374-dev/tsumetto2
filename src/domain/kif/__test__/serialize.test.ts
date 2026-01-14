import { describe, expect, it } from "vitest";
import { Piece } from "../types/Piece";

describe("serialize", ()=>{
    it("piece", ()=>{
        const piece = new Piece("bishop", "black")
        expect(Piece.fromJSON(piece.toJSON())).toEqual(piece)

        const serialized = piece.toJSON()
        expect(serialized).toEqual(new Piece("bishop", "black", false))           
       
    })
})