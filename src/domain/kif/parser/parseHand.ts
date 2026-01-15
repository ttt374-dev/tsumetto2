import { Hand, type PieceType } from "../types"
import { kanjiToPieceItem } from "./parseInitialState"


function parseHand(handStr: string): Hand {
    const counts: Partial<Record<PieceType, number>> = {}

    // 空白を除去
    const str = handStr.replace(/\s/g, '')

    // 正規表現：漢字1文字 + 数字0～2桁
    const regex = /([歩香桂銀金角馬飛龍竜])(\d{0,2})/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(str)) !== null) {
        const kanji = match[1]
        const numStr = match[2]

        const item = kanjiToPieceItem[kanji]
        if (!item) throw new Error(`Unknown piece kanji: ${kanji}`)

        const n = numStr ? parseInt(numStr, 10) : 1

        // 成り駒は手駒にする場合、promoted を無視して基本駒の type を使用
        const pieceType = item.type

        counts[pieceType] = (counts[pieceType] || 0) + n
    }

    return new Hand(counts)
}
