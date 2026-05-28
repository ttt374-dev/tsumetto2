import { describe, expect, it } from "vitest";
import { Piece } from "../../entity/Piece";
import { Position } from "../../entity";
import { pink } from "@mui/material/colors";
import { parseKif } from "../parser/parseKif";

describe("serialize", ()=>{
    it("piece", ()=>{
        const piece = Piece.create("bishop", "black")
        expect(Piece.fromDTO(piece.toDTO())).toEqual(piece)

        const serialized = piece.toDTO()
        expect(serialized).toEqual(Piece.create("bishop", "black", false))           
       
    })

    it("boardstate", () => {
        const boardState = Position.create()
        expect(Position.fromDTO(boardState.toDTO())).toEqual(boardState)
    })

    it("parsed data", () => {
                const text = `手合割：平手
先手：
後手：
手数----指手---------消費時間--
   1 ７六歩(77)        ( 0:00/00:00:00)
   2 ３四歩(33)        ( 0:00/00:00:00)
   3 ６六歩(67)        ( 0:00/00:00:00)
   4 ８四歩(83)        ( 0:00/00:00:00)
   5 ７八飛(28)        ( 0:00/00:00:00)`
        const r = parseKif(text)
        expect(r.ok).toBeTruthy
        if (r.ok){
            const boardState = r.value.initialPosition
            expect(Position.fromDTO(boardState.toDTO())).toEqual(boardState)           
        }
    })
    it("stringfy", () => {

    })
})