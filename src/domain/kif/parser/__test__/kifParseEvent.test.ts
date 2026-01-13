// utils/parser/handParser.test.ts
import { describe, it, expect } from 'vitest'
import { parseEventLine } from '../kifParseEvent'

// GameEnd
describe("parse event", () => {
    it("投了", () => {
        const result = parseEventLine("115 投了 (00:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
                type: "end", 
                reason: "resign",
                winner: 'black'
            }
        })
    })
})

// Move
describe("parseEventLineText", () => {
    it("move lineを parse", () => {
        const result = parseEventLine("   3 ２五歩(26)        ( 0:00/00:00:00)");

        expect(result).toEqual({
            ok: true,
            value: {
                type: "move",
                plyNumber: 3,
                moveText: "２五歩",
                piece: {
                    key: "歩",
                    owner: 'black',
                },
                to: { file: 2, rank: 5 },
                from: { file: 2, rank: 6 },
                drop: false,
                player: 'black',
            }
        }
        )
    })

    it("同", () => {
        const result = parseEventLine("   2 同　玉(13)        ( 0:00/00:00:00)", { file: 3, rank: 2 });
        expect(result).toEqual({
            ok: true,
            value: {
                type: "move",
                plyNumber: 2,
                moveText: "同　玉",
                piece: {
                    key: "玉",
                    owner: 'white',
                },
                to: { file: 3, rank: 2 },
                from: { file: 1, rank: 3 },
                drop: false,
                player: 'white',
            }
        })

    })
    it("成らず", () => {
        const result = parseEventLine("   5 ２四銀不成(25)         ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
                type: "move",
                plyNumber: 5,
                moveText: "２四銀不成",
                piece: {
                    key: "銀",
                    owner: 'black',
                },
                to: { file: 2, rank: 4 },
                from: { file: 2, rank: 5 },
                drop: false,
                player: 'black',
            }
        })
    })
    it("打", () => {
        const result = parseEventLine("   5 ２四金打           ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
                type: "move",
                plyNumber: 5,
                moveText: "２四金打",
                piece: {
                    key: "金",
                    owner: 'black',
                },
                to: { file: 2, rank: 4 },
                from: undefined,
                drop: true,
                player: 'black',
            }
        })
    })
    it("右", () => {
        const result = parseEventLine("   5 ２四金右(23)           ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
                type: "move",
                plyNumber: 5,
                moveText: "２四金右",
                piece: {
                    key: "金", owner: 'black',
                },
                to: { file: 2, rank: 4 },
                from: { file: 2, rank: 3 },
                drop: false,
                player: 'black',
            }
        })
    })

    it("不正値", () => {
        const result = parseEventLine("20 金３２(44)")
        expect(result.ok).toBeFalsy
    })
})

