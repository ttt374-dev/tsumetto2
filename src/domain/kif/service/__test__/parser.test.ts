import { describe, expect, it } from "vitest";
import { Board, Position, Hand, Hands, Move, Square } from "../../entity";
import { parseKif } from "../parser/parseKif";
import { parseMoveLine, parseMoves } from "../parser/parseMove";
import { buildUntilPly } from "../buildUntilPly";
import { parseHand } from "../parser/parseHand";
import { responsiveFontSizes } from "@mui/material";
import { ReportProblem } from "@mui/icons-material";

describe("parse moves", () => {
    it("move", () => {
        const text = "   2 １四歩(13)        ( 0:00/00:00:00)"
        const res = parseMoveLine(text)
        expect(res.ok).toBeTruthy
        if (!res.ok || res.value.kind === "skip") {
            throw new Error(`expected parsed but got`)
        }       

        expect(res.value.move.pieceType).toEqual("pawn")
        expect(res.value.move.from).toEqual({ file: 1, rank: 3 })
        expect(res.value.move.to).toEqual({ file: 1, rank: 4 })

    })
    it("同", () => {
        const text = [
            "1 ３三飛成(35)       ( 0:00/00:00:00)",
            "2 同　桂(21)        ( 0:00/00:00:00)"]

        const res = parseMoves(text)
        if (!res.ok) {
            throw new Error(`expected parsed but got`)
        }
        const moves = res.value

        expect(moves[1]).toBeTruthy
        expect(moves[1].to).toEqual({ file: 3, rank: 3 })

    })
    it("打", () => {
        const text = "  55 ５五桂打        "
        const res = parseMoveLine(text)
        if (!res.ok || res.value.kind === "skip") {
            throw new Error(`expected parsed but got`)
        }    

        expect(res.value.move.pieceType).toEqual("knight")
        expect(res.value.move.to).toEqual({ file: 5, rank: 5 })
        expect(res.value.move.isDrop).toBeTruthy

    })
    it("桂成", () => {
        const text = "  1 ５五桂成(29)"
        const res = parseMoveLine(text)
        if (!res.ok || res.value.kind === "skip") {
            throw new Error(`expected parsed but got`)
        }

        expect(res.value.move.pieceType).toEqual("knight")
        expect(res.value.move.promote).toBeTruthy

    })
    it("成桂", () => {
        const text = "  1 ５五成桂(29)"
        //let state = BoardState.create()
        const hands = Hands.empty()
        let state = new Position(Board.create(), hands.add('black', 'knight'))
        const drop = new Move(null, Square.create(2, 9), "knight")
        let resPosition = drop.apply(state)
        if (!resPosition.ok) throw new Error
        state = resPosition.value
        const res = parseMoveLine(text)
        if (!res.ok || res.value.kind === "skip") {
            throw new Error(`expected parsed but got`)
        }

        expect(res.value.move.pieceType).toEqual("knight")
        resPosition = res.value.move.apply(state)
        if (!resPosition.ok) throw new Error
        state = resPosition.value
        const sq = new Square(5, 5)
        expect(state.board.get(sq)?.promoted).toBeTruthy
        expect(state.board.get(sq)?.type).toEqual("knight")

    })
    it("右", () => {
        const text = "   2 １四金右(13)        ( 0:00/00:00:00)"
        const res = parseMoveLine(text)
        if (!res.ok || res.value.kind === "skip") {
            throw new Error(`expected parsed but got`)
        }
        expect(res.value.move.pieceType).toEqual("gold")

    })
    it("龍", () => {
        const text = "  1 １二龍(29)"
        const res = parseMoveLine(text)
        
        if (!res.ok || res.value.kind === "skip") throw new Error()
        expect(res.value.move.promote).toBeFalsy
        
    })
})

describe("parse hand", () => {
    it("hand", () => {
        const text = "飛 角二 金四 銀三 桂四 香四 歩十七 "
        const res = parseHand(text)

        if (!res.ok) throw new Error("parse error")
        const hand = res.value
        expect(hand.count("bishop")).toEqual(2)
        expect(hand.count("rook")).toEqual(1)
        expect(hand.count("pawn")).toEqual(17)
    })
})
describe("parse header", () => {
    const text = `開始日時：2025/12/29 13:00:40
終了日時：2025/12/29 13:16:44
場所：将棋ウォーズ
先手：xxx
後手：yyy
手数----指手---------消費時間--
`
    it("headers", () => {
        const r = parseKif(text)
        expect(!r.ok).toBeTruthy
        if (!r.ok) return
        const { headers } = r.value
        expect(headers["場所"]).toEqual("将棋ウォーズ")
        expect(headers["先手"]).toEqual("xxx")
    })
})

describe("parse board", () => {
    const text = `
後手の持駒：飛 角二 金四 銀三 桂四 香四 歩十七 
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
| ・ ・ ・ ・ ・ ・ ・ ・ ・|一
| ・ ・ ・ ・ ・ ・ 龍 銀v玉|二
| ・ ・ ・ ・ ・ ・ ・ ・ ・|三
| ・ ・ ・ ・ ・ ・v歩 ・ ・|四
| ・ ・ ・ ・ ・ ・ ・ ・ ・|五
| ・ ・ ・ ・ ・ ・ ・ ・ ・|六
| ・ ・ ・ ・ ・ ・ ・ ・ ・|七
| ・ ・ ・ ・ ・ ・ ・ ・ ・|八
| ・ ・ ・ ・ ・ ・ ・ ・ ・|九
+---------------------------+
先手の持駒：なし
先手：
後手：
手数----指手---------消費時間--
   1 ３三銀(22)        ( 0:00/00:00:00)
   2 ２三玉(12)        ( 0:00/00:00:00)
   3 ２二飛成(32)       ( 0:00/00:00:00)
   4 １四玉(23)        ( 0:00/00:00:00)
   5 ２四龍(22)        ( 0:00/00:00:00)
`
    it("invalid text check", () => {
        const text = `invalid data text
    foo bar`
        const res = parseKif(text)

        if (res.ok) throw new Error("parse error error")
        //expect(res.error.code).toEqual("no-valid-splitter")  // TODO

    })

    it("盤面情報がない場合は平手", () => {
        const text = `
手数----指手---------消費時間--
`

        const r = parseKif(text)
        expect(r.ok).toBeTruthy
        if (r.ok) {
            const board = r.value.initialPosition.board
            expect(board.get(new Square(1, 3))?.type).toEqual('pawn')
        }
    })
    it("持ち駒", () => {
        const r = parseKif(text)
        expect(r.ok).toBeTruthy
        if (r.ok) {
            const hands = r.value.initialPosition.hands
            expect(hands.get("white").count("bishop")).toEqual(2)
        }
    })
})


describe("実録parse", () => {
    it("平手", () => {
        const text = `手合割：平手
先手：
後手：
手数----指手---------消費時間--
   1 ７六歩(77)        ( 0:00/00:00:00)
   2 ３四歩(33)        ( 0:00/00:00:00)
   3 ６六歩(67)        ( 0:00/00:00:00)
   4 ８四歩(83)        ( 0:00/00:00:00)
   5 ７八飛(28)        ( 0:00/00:00:00)
   6 ８五歩(84)        ( 0:00/00:00:00)
   7 ７七角(88)        ( 0:00/00:00:00)
   8 ６二銀(71)        ( 0:00/00:00:00)
   9 ６八銀(79)        ( 0:00/00:00:00)
  10 ４二玉(51)        ( 0:00/00:00:00)
  11 ４八玉(59)        ( 0:00/00:00:00)`
        const r = parseKif(text)
        if (r.ok) {
            const moves = r.value.moves
            expect(moves.length).toEqual(11)
            //const initial = Position.create()
            //initial.board.dump()
            //const history = { initial: Position.create(), moves: moves }
            const resPosition = buildUntilPly(Position.create(), moves, 11)
            if (!resPosition.ok) throw new Error
            expect(resPosition.value.board.get(new Square(4, 8))?.type).toEqual("king")
        }
    })

    it("将棋ウォーズ", () => {
        const text = `開始日時：2026/02/19 15:46:36
終了日時：2026/02/19 15:56:29
場所：将棋ウォーズ
手合割：平手
先手：ttt374
後手：156kam
手数----指手---------消費時間--
   1 ２六歩(27)    ( 0:00/00:00:00)
   2 ３二金(41)    ( 0:00/00:00:00)
   3 ２五歩(26)    ( 0:00/00:00:00)
   4 ５二飛(82)    ( 0:00/00:00:00)
   5 ３八銀(39)    ( 0:00/00:00:00)
   6 ３四歩(33)    ( 0:00/00:00:00)
   7 ２七銀(38)    ( 0:00/00:00:00)
   8 ３三桂(21)    ( 0:00/00:00:00)
   9 ２六銀(27)    ( 0:00/00:00:00)
  10 ７四歩(73)    ( 0:00/00:00:00)
  11 ７六歩(77)    ( 0:00/00:00:00)
  12 ７三桂(81)    ( 0:00/00:00:00)
  13 ６六歩(67)    ( 0:00/00:00:00)
  14 ６四歩(63)    ( 0:00/00:00:00)
  15 ７八金(69)    ( 0:00/00:00:00)
  16 ６五歩(64)    ( 0:00/00:00:00)
  17 ５八金(49)    ( 0:00/00:00:00)
  18 ６六歩(65)    ( 0:00/00:00:00)
  19 ６六角(88)    ( 0:00/00:00:00)
  20 ６五歩打    ( 0:00/00:00:00)
  21 ７七角(66)    ( 0:00/00:00:00)
  22 ７二金(61)    ( 0:00/00:00:00)
  23 ３六歩(37)    ( 0:00/00:00:00)
  24 ５四歩(53)    ( 0:00/00:00:00)
  25 １五銀(26)    ( 0:00/00:00:00)
  26 ４五桂(33)    ( 0:00/00:00:00)
  27 ２四歩(25)    ( 0:00/00:00:00)
  76 投了    ( 0:00/00:00:00)
まで75手で先手の勝ち
  `
        const r = parseKif(text)
        expect(r.ok).toBeTruthy
    })
    

})