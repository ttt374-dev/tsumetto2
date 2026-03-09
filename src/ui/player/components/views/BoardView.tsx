import { Box, Stack } from "@mui/material";
import { Position, Hand, kanjiToPieceItem, type PieceType, Piece, Board, type Player, Square } from "@/domain/kif/entity";
import { numberToKanjiTwoDigits } from "../../../common/utils/numberToKanji";

import styles from "./BoardView.module.css";
import { formatPlayer } from "./MovesView";
import { useContext, useEffect } from "react";
import { useReplayStore } from "../../hooks/useReplayStore";

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
            {formatPlayer(owner)}{formatHand(hand)}
        </div>
    )
}
function SquareView({ piece, file, rank }: { 
    file: number
    rank: number
    piece: Piece | null
}
) {
    const selectSquare = useReplayStore(s => s.selectSquare)
    const currentPlayer = useReplayStore(s => s.currentPlayer)
    const tryMoveTo = useReplayStore(s => s.tryMoveTo)
    const selected = useReplayStore(s => s.selected)
    const isSelected = selected?.square.file === file && selected?.square.rank === rank

    const handleSquareClick = () => {
        if (selected) {
            const ok = tryMoveTo({ file, rank })
            if (!ok) alert("間違った手です")
        } else {
            if (piece) selectSquare(file, rank, piece)
        }
    }

    return (
        <div
            className={`${styles.cell}  
            ${selected && styles.selected}
            ${piece?.owner === 'white' ? styles.white : ''}`}
            onClick={handleSquareClick}
        >
            {piece ? piece.format() : null} 
        </div>
    )
}
///////////////////////////////
function BoardView({ position }: { position: Position }) {
    const { board, hands } = position
    const ranks = [...Array(9)].map((_, i) => i + 1)   //   1 → 9
    const files = [...Array(9)].map((_, i) => 9 - i)   // 9 → 1（将棋表記） ???

    return (
        <Stack justifyContent="center">
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get("white")} owner="white" />

                <Box className={styles.board}>
                    {/* 上の筋表示 */}
                    <div></div>
                    {fileLabels.map((f, i) => (
                        <div key={i} className={styles.fileLabel}>{f}</div>
                    ))}
                    <div></div>
                    {/* 盤面 + 左側の段表示 */}
                    {ranks.flatMap(rank => {
                        const cells = files.map(file => {
                            const piece = board.get(file, rank)
                            return (
                                <SquareView
                                    key={Board.squareKey(file, rank)}
                                    file={file}
                                    rank={rank}
                                    piece={piece}                                   
                                />
                            )
                        })
                        const empty = <div></div>
                        const rankLabel = <div className={styles.rankLabel}>
                            {rankLabels[rank - 1]}
                        </div>
                        return [empty, ...cells, rankLabel,]
                    }

                    )}
                </Box>
                {/* 持駒表示 */}
                <HandView hand={hands.get("black")} owner="black" />
            </Box>
        </Stack >
    )
}

export default BoardView;
