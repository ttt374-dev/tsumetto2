import { Box } from "@mui/material";
import styles from "./BoardView.module.css";
import type { Board } from "@/domain/kif/types/Board";
import { BoardState, displayPiece, Hand, kanjiToPieceItem, type Hands, type Piece, type PieceType, type Player } from "@/domain/kif/types";
import { numberToKanjiTwoDigits } from "./numberToKanji";

interface Props {
    board: Board;
    hands: Hands;

}

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
//const rankLabels = ["", "九", "八", "七", "六", "五", "四", "三", "二", "一"];


function formatHand(hand: Hand): string {
    const parts: string[] = [];    

    const kanjikeys = Object.entries(kanjiToPieceItem)
        .filter(([key, item]) => !item.promoted && key !== "王" && key !== "玉")
        .map(([key]) => key as PieceType)
        .reverse(); // 逆順
    
    

    kanjikeys.forEach(kanjipieceType => {        
        const item = kanjiToPieceItem[kanjipieceType]
        const count = hand.count(item.type);
        if (count > 0) {
            const suffix = numberToKanjiTwoDigits(count) ?? count.toString();
            parts.push(`${kanjipieceType}${suffix}`);
        }
    });
    //console.log(parts)        
    return parts.length === 0 ? "なし" : parts.join(" ");
}
function BoardView({ board, hands }: Props ) {
    const ranks = [...Array(9)].map((_, i) => i +1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    return (
        <Box className={styles.container}>
            {/* 持駒表示 */}
            <div>
                △後手：{formatHand(hands.get("white"))}
            </div>
            {/* 上の筋表示 */}
            <div className={styles.fileLabels}>
                <div className={styles.corner}></div> {/* 左上の空白 */}
                {fileLabels.map((f, i) => (
                    <div key={i} className={styles.fileLabel}>{f}</div>
                ))}
            </div>

            {/* 盤面 + 左側の段表示 */}
            {ranks.map(rank => (
                <div className={styles.rowWithRank}>
                    {/* 左側の段表示（スペース） */}
                    <div className={styles.rankLabel}></div>
                    {/* 盤面の行 */}
                    {files.map(file => {
                        const sq = { file, rank }
                        const key = `${file},${rank}`
                        const piece = board.get(sq)
                        if (!piece) {
                            return <div key={key} className={styles.emptyCell} />;
                        }
                        return (
                            <div 
                            className={`${styles.cell} ${piece.owner === 'white' && styles.white}  :`}
                            >  
                                {piece ? displayPiece(piece.type, piece.promoted) : ""}
                            </div>
                        )
                    })}
                    <div className={styles.rankLabel}>{rankLabels[rank-1]}</div>
                </div>)
            )}
            {/* 持駒表示 */}
            <div>
                △先手：{formatHand(hands.get("black"))}
            </div>
        </Box>
    )


}

export default BoardView;
