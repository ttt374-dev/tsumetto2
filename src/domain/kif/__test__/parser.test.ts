import { describe, expect, it } from "vitest";
import { Board, Position, Hand, Hands, Move } from "../types";
import { parseKif } from "../parser/parseKif";
import { parseMoveLine } from "../parser/parseMove";
import { buildUntilPly } from "../buildUntilPly";
import { parseHand } from "../parser/parseHand";


describe("parse moves", () => {
    it("move", () => {
        const text = "   2 １四歩(13)        ( 0:00/00:00:00)"
        const move = parseMoveLine(text)
        expect(move).toBeTruthy
        if (move){
            expect(move?.pieceType).toEqual("pawn")
            expect(move.from).toEqual({file: 1, rank: 3})
            expect(move.to).toEqual({file: 1, rank: 4})
        }
    })

    it("打", () => {
        const text = "  55 ５五桂打        "
        const state = Position.create()
        const parsed = parseMoveLine(text)
        expect(parsed).toBeTruthy
        if (parsed) {
            expect(parsed.pieceType).toEqual("knight")
            expect(parsed.to).toEqual({ file: 5, rank: 5 })
            expect(parsed.isDrop).toBeTruthy
        }        
    })
    it("桂成", () => {
        const text = "  1 ５五桂成(29)"
        const parsed = parseMoveLine(text)
        expect(parsed).toBeTruthy
        if (parsed) {
            expect(parsed.pieceType).toEqual("knight")
            expect(parsed.promote).toBeTruthy

        }
    })
    it("成桂", () => {
        
        const text = "  1 ５五成桂(29)"
        //let state = BoardState.create()
        const hands = Hands.empty()
        let state = new Position(Board.create(), hands.add('black', 'knight'))
        const drop = new Move(null, {file: 2, rank: 9}, "knight")
        state = drop.apply(state)
        const parsed = parseMoveLine(text)
        expect(parsed).toBeTruthy
        if (parsed){
            expect(parsed.pieceType).toEqual("knight")            
            state = parsed.apply(state)
            expect(state.board.get(5, 5)?.promoted).toBeTruthy
            expect(state.board.get(5, 5)?.type).toEqual("knight")
        }       
        
    })
    it("右", () => {
        const text = "   2 １四金右(13)        ( 0:00/00:00:00)"
        const state = Position.create()
        const parsed = parseMoveLine(text)
        expect(!parsed).toBeTruthy
        if (parsed){
            expect(parsed.pieceType).toEqual("gold")
        }
    })
})

describe("parse hand", () => {
    it ("hand", () => {
        const text="飛 角二 金四 銀三 桂四 香四 歩十七 "
        const hand = parseHand(text)
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
    const text=`
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
        const r = parseKif(text)
        expect(r.ok).toBeFalsy
        !r.ok &&
            expect(r.message).toEqual("invalid format: no valid splitter")
    })

    it("盤面情報がない場合は平手", () => {
        const text = `
手数----指手---------消費時間--
`

        const r = parseKif(text)
        expect(r.ok).toBeTruthy
        if (r.ok) {
            const board = r.value.initialPosition.board
            expect(board.get(1, 3)?.type).toEqual('pawn')
        }
    })
    it ("持ち駒", () => {
        const r = parseKif(text)
        expect(r.ok).toBeTruthy
        if (r.ok){
            const hands = r.value.initialPosition.hands
            expect(hands.get("white").count("bishop")).toEqual(2)
        }
    })
})


describe("実録", () => {
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
        if (r.ok){
            const moves = r.value.moves
            expect(moves.length).toEqual(11)
            const initial = Position.create()
            //initial.board.dump()
            const history = { initial: Position.create(), moves: moves}
            const state = buildUntilPly(history, 11)
            expect(state.board.get(4, 8)?.type).toEqual("king")
        }
    })    
})