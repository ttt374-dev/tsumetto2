import { Box, Stack } from "@mui/material";
import { Position, Hand, kanjiToPieceItem, type PieceType, Piece, Board, type Player } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "./numberToKanji";

import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";

const fileLabels = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
const rankLabels = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];

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
            const suffix = count > 1 ? (numberToKanjiTwoDigits(count) ?? count.toString()) : ""
            parts.push(`${kanjipieceType}${suffix}`);
        }
    });
    //console.log(parts)        
    return parts.length === 0 ? "なし" : parts.join(" ");
}

/////////////////////////////
function HandView({ hand, owner }: { hand: Hand, owner: Player }) {
    return (
        <div>
            { formatPlayer(owner)}{formatHand(hand)}
        </div>
    )
}
function SquareView({ piece }: { piece: Piece | null }) {

    if (!piece) {
        return <div className={styles.emptyCell} />;
    } else {
        return (
            <div
                className={`${styles.cell} ${piece.owner === 'white' && styles.white}  :`}
            >
                {piece.format()}
            </div>
        )
    }
}
///////////////////////////////
function BoardView({ position }: { position: Position }) {
    const { board, hands } = position
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    return (
        <Stack justifyContent="center">
            <Box>   { /* センタリングするために必要 */ }
                <Box className={styles.container}>
                    {/* 持駒表示 */}
                    <HandView hand={hands.get("white")} owner="white" />
                    {/* 上の筋表示 */}
                    <div className={styles.fileLabels}>
                        <div className={styles.corner}></div> {/* 左上の空白 */}
                        {fileLabels.map((f, i) => (
                            <div key={i} className={styles.fileLabel}>{f}</div>
                        ))}
                    </div>

                    {/* 盤面 + 左側の段表示 */}
                    {ranks.map(rank => (
                        <div key={`rank:${rank}`} className={styles.rowWithRank}>
                            {/* 左側の段表示（スペース） */}
                            <div className={styles.rankLabel}></div>
                            {/* 盤面の行 */}
                            {files.map(file => {
                                //const sq = Square.create(file, rank)
                                const piece = board.get(file, rank)
                                return (
                                    <div key={Board.squareKey(file, rank)}>
                                        <SquareView piece={piece} />
                                    </div>
                                )
                            })}
                            <div className={styles.rankLabel}>{rankLabels[rank - 1]}</div>
                        </div>)
                    )}
                    {/* 持駒表示 */}
                    <HandView hand={hands.get("black")} owner="black" />
                </Box>
            </Box>
        </Stack >
    )
}

export default BoardView;
