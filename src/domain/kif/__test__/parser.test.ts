import { describe, expect, it } from "vitest";
import { BoardState } from "../types";
import { parseMoveLine } from "../parser/parseKif";

describe("parser", ()=> {
    it("move", () => {
        const text = "   2 ３三玉(43)        ( 0:00/00:00:00)"
        const state = BoardState.empty()
        const parsed = parseMoveLine(text, 1, state)
        expect(parsed.pieceType).toEqual("king")
    })

    it("打", () => {
        const text = "  55 ５五桂打        "
        const state = BoardState.empty()
        const parsed = parseMoveLine(text, 1, state)
        expect(parsed.pieceType).toEqual("knight")
        expect(parsed.to).toEqual({file: 5, rank: 5})
        expect(parsed.isDrop).toBeTruthy
    })
})