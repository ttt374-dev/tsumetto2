// utils/parser/handParser.test.ts
import { describe, it, expect } from 'vitest'
import { parsePosition } from '../kifParsePosition';


describe("parsePosition", () => {
    it("position", () => {
        const result = parsePosition("１六", { file: 2, rank: 3});

        expect(result).toEqual({
            
                ok: true,
                value: {
                    file: 1, rank: 6                
            }
        }
        )
    })
    it("同", () => {
        const result = parsePosition("同　", { file: 3, rank: 4})
        expect(result).toEqual({
            ok: true,
            value: { file: 3, rank: 4}
        })
    })
    it("同だけどprevがない", () => {
        const result = parsePosition("同　")
        expect(result).toEqual({
            ok: false,
            error: {
                message: "no prev position given for DOU"
            }
        })
    })
    it("不正値", () => {
        const result = parsePosition("三六", { file: 3, rank: 4})
        expect(result).toEqual({
            ok: false,
            error: {
                message: "invalid move: 三六: NaN 6"
            }
        })
    })
})
