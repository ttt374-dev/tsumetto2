import type { Result } from "@/application/result"
import { Hand, kanjiToPieceItem, type PieceType } from "../types"
import type { ParseError } from "./ParseError"



export type ParseHandResult = Result<Hand, ParseError>

export function parseHand(handStr: string): ParseHandResult {
    const counts: Partial<Record<PieceType, number>> = {}
    if (!handStr || handStr === "なし") return {
        ok: true, value: Hand.empty()
    }

    const str = handStr.replace(/\s/g, '')

    // 正規表現：漢字1文字 + 数字または漢数字（0～2桁 or 一二三…十百）
    const regex = /([歩香桂銀金角馬飛])([0-9一二三四五六七八九十百]+)?/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(str)) !== null) {
        const kanji = match[1]
        const numStr = match[2]

        const item = kanjiToPieceItem[kanji]
        //if (!item) throw new Error(`Unknown piece kanji: ${kanji}`)
        if (!item) return { ok: false, error: { code: "unknown-piece-kanji", cause: {kanji}}}

        const n = numStr
            ? (/^[0-9]+$/.test(numStr)
                ? parseInt(numStr, 10)
                : kanjiNumberToInt(numStr))
            : 1

        // 成り駒は手駒にする場合、promoted を無視
        const pieceType = item.type
        counts[pieceType] = (counts[pieceType] || 0) + n
        //console.log("parse hand", pieceType, counts[pieceType])
    }

    return { ok: true, value: new Hand(counts) }
}



function kanjiNumberToInt(kanjiNum: string): number {
    if (!kanjiNum) return 1

    const kanjiMap: Record<string, number> = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9
    }

    // 「十」「十一」～「十九」まで対応
    if (kanjiNum === '十') return 10
    if (kanjiNum.startsWith('十')) {
        const unit = kanjiMap[kanjiNum[1]] ?? 0
        return 10 + unit
    }
    if (kanjiNum.endsWith('十')) {
        const ten = kanjiMap[kanjiNum[0]] ?? 0
        return ten * 10
    }
    if (kanjiNum.includes('十')) {
        const parts = kanjiNum.split('十')
        const ten = kanjiMap[parts[0]] ?? 1
        const unit = parts[1] ? kanjiMap[parts[1]] ?? 0 : 0
        return ten * 10 + unit
    }

    // 単純な一桁
    return kanjiMap[kanjiNum] ?? 1
}
