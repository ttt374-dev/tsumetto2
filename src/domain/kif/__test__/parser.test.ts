import { describe, expect, it } from "vitest";
import { BoardState } from "../types";
import { parseKif } from "../parser/parseKif";
import { PanoramaFishEyeSharp } from "@mui/icons-material";
import { parseMoveLine } from "../parser/parseMove";

describe("parse moves", ()=> {
    it("move", () => {
        const text = "   2 ３三玉(43)        ( 0:00/00:00:00)"
        const state = BoardState.create()
        const parsed = parseMoveLine(text, 1, state)
        expect(parsed.pieceType).toEqual("king")
    })

    it("打", () => {
        const text = "  55 ５五桂打        "
        const state = BoardState.create()
        const parsed = parseMoveLine(text, 1, state)
        expect(parsed.pieceType).toEqual("knight")
        expect(parsed.to).toEqual({file: 5, rank: 5})
        expect(parsed.isDrop).toBeTruthy
    })
})

describe("parse header", () => {
    const text =`開始日時：2025/12/29 13:00:40
終了日時：2025/12/29 13:16:44
場所：将棋ウォーズ
後手の持駒：飛 角 金三 銀四 桂四 香四 歩十八 
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
| ・ ・ ・ ・ ・ ・ 角 ・ ・|一
| ・ ・ ・ ・ ・ ・ ・ ・v玉|二
| ・ ・ ・ ・ ・ ・ ・ ・ ・|三
| ・ ・ ・ ・ ・ ・v金 ・ ・|四
| ・ ・ ・ ・ ・ 飛 ・ ・ ・|五
| ・ ・ ・ ・ ・ ・ ・ ・ ・|六
| ・ ・ ・ ・ ・ ・ ・ ・ ・|七
| ・ ・ ・ ・ ・ ・ ・ ・ ・|八
| ・ ・ ・ ・ ・ ・ ・ ・ ・|九
+---------------------------+
先手の持駒：なし
先手：xxx
後手：yyy
手数----指手---------消費時間--
   1 １五飛(45)        ( 0:00/00:00:00)
   2 ２三玉(12)        ( 0:00/00:00:00)
   3 １三飛成(15)       ( 0:00/00:00:00)`


    it("headers", () => {
        const r = parseKif(text)
        expect(!r.ok).toBeTruthy
        if (!r.ok) return
        const { headers } = r.value
        expect(headers["場所"]).toEqual("将棋ウォーズ")
        expect(headers["先手"]).toEqual("xxx")
    })
})

describe("parse erro check", () => {
    it("invalid text check", () => {
        const text = `invalid data text
    foo bar`
        const r = parseKif(text)
        expect(r.ok).toBeFalsy
        !r.ok &&
            expect(r.message).toEqual("invalid format: no valid splitter")
    })

    it("手数行はあるけど盤面情報がない", () => {
        const text = `
手数----指手---------消費時間--
   1 ７六歩(77)        ( 0:00/00:00:00)
   2 ３四歩(33)        ( 0:00/00:00:00)
   3 ６六歩(67)        ( 0:00/00:00:00)
   4 ８四歩(83)        ( 0:00/00:00:00)`

        const r = parseKif(text)
        expect(r.ok).toBeFalsy
        !r.ok &&
            expect(r.message).toEqual("no board information")

    })
})
