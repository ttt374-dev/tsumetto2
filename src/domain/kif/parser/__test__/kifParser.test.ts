import { describe, it, expect } from 'vitest'
import { parseEventLine } from '../kifParseEvent'
import { parseKif } from '../kifParser'
import { AdfScannerRounded } from '@mui/icons-material'
import { aspectRatioClasses } from '@mui/joy'

// GameEnd
describe("kif pasrer", () => {
    it("normal", () => {
        const text = `開始日時：2025/10/16 10:02:00
終了日時：2025/10/16 23:35:00
棋戦：順位戦
場所：東京・将棋会館
持ち時間：6時間
消費時間：114▲360△360
手合割：平手
先手：伊藤真吾 六段
後手：谷合廣紀 五段
戦型：四間飛車
手数----指手---------消費時間--
1 ２六歩(27) (00:00/00:00:00)
2 ３四歩(33) (00:00/00:00:00)
3 ７六歩(77) (00:00/00:00:00)
4 ４四歩(43) (00:00/00:00:00)
5 ４八銀(39) (00:00/00:00:00)
6 ９四歩(93) (00:00/00:00:00)
7 ９六歩(97) (00:00/00:00:00)
8 ４二飛(82) (00:00/00:00:00)
9 ６八玉(59) (00:00/00:00:00)
10 ７二銀(71) (00:00/00:00:00)`
        const kifDataResult = parseKif(text)
        expect(kifDataResult.ok).toBeTruthy

        if (kifDataResult.ok){
            expect(kifDataResult.value.events.length).toEqual(10)
            expect(kifDataResult.value.headers['手合割']).toEqual('平手')            
        }
        
    })

    it("invalid", () => {
        const text=`ads;laskjef;lkajes;l
asf, fe,sf
AdfScannerRounded

aspectRatioClasses***`
        const kifDataResult = parseKif(text)
        expect(kifDataResult.ok).toBeFalsy
    })
})